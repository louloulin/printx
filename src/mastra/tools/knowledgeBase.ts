import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

// 读取知识库数据
const readKnowledgeBaseData = () => {
  try {
    const dataPath = path.join(process.cwd(), 'src/data/knowledgeBase.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading knowledge base data:', error);
    return { categories: [] };
  }
};

// 知识库查询工具
export const knowledgeBaseTool = createTool({
  id: 'queryKnowledgeBase',
  description: '查询装修知识库，获取关于装修流程、设计风格、材料选择、施工管理等方面的专业知识',
  inputSchema: z.object({
    query: z.string().describe('查询关键词或问题'),
    category: z.string().optional().describe('知识类别，如"装修流程"、"设计风格"、"材料选择"、"施工管理"、"预算规划"等')
  }),
  outputSchema: z.object({
    articles: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        category: z.string(),
        tags: z.array(z.string())
      })
    ),
    message: z.string()
  }),
  execute: async ({ context }) => {
    const { query, category } = context;
    
    // 读取知识库数据
    const data = readKnowledgeBaseData();
    const categories = data.categories || [];
    
    let results = [];
    
    // 处理所有文章
    categories.forEach(cat => {
      // 如果指定了类别且不匹配，则跳过
      if (category && !cat.name.toLowerCase().includes(category.toLowerCase())) {
        return;
      }
      
      const articles = cat.articles || [];
      
      articles.forEach(article => {
        // 检查是否包含查询关键词
        const matchesQuery = 
          article.title.toLowerCase().includes(query.toLowerCase()) || 
          article.content.toLowerCase().includes(query.toLowerCase()) ||
          article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
        
        if (matchesQuery) {
          results.push({
            id: article.id,
            title: article.title,
            content: article.content,
            category: cat.name,
            tags: article.tags
          });
        }
      });
    });
    
    // 按相关性排序（简单实现：标题匹配的排在前面）
    results.sort((a, b) => {
      const aMatchesTitle = a.title.toLowerCase().includes(query.toLowerCase());
      const bMatchesTitle = b.title.toLowerCase().includes(query.toLowerCase());
      
      if (aMatchesTitle && !bMatchesTitle) return -1;
      if (!aMatchesTitle && bMatchesTitle) return 1;
      return 0;
    });
    
    return {
      articles: results,
      message: results.length > 0 
        ? `找到${results.length}篇与"${query}"相关的文章。` 
        : `没有找到与"${query}"相关的文章。`
    };
  }
});

// 装修问答工具
export const renovationQATool = createTool({
  id: 'renovationQA',
  description: '回答关于装修的常见问题，提供专业建议',
  inputSchema: z.object({
    question: z.string().describe('关于装修的问题')
  }),
  outputSchema: z.object({
    answer: z.string(),
    relatedArticles: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        category: z.string()
      })
    ),
    message: z.string()
  }),
  execute: async ({ context }) => {
    const { question } = context;
    
    // 读取知识库数据
    const data = readKnowledgeBaseData();
    const categories = data.categories || [];
    
    // 提取问题中的关键词（简单实现）
    const keywords = question.toLowerCase()
      .replace(/[?？.,，。!！]/g, '')
      .split(' ')
      .filter(word => word.length > 1);
    
    // 查找相关文章
    let relatedArticles = [];
    let mostRelevantContent = '';
    
    categories.forEach(cat => {
      const articles = cat.articles || [];
      
      articles.forEach(article => {
        // 计算相关性分数
        let relevanceScore = 0;
        
        // 标题中包含关键词加分
        keywords.forEach(keyword => {
          if (article.title.toLowerCase().includes(keyword)) {
            relevanceScore += 3;
          }
          
          // 内容中包含关键词加分
          if (article.content.toLowerCase().includes(keyword)) {
            relevanceScore += 1;
          }
          
          // 标签中包含关键词加分
          if (article.tags.some(tag => tag.toLowerCase().includes(keyword))) {
            relevanceScore += 2;
          }
        });
        
        // 如果相关性分数大于0，添加到相关文章列表
        if (relevanceScore > 0) {
          relatedArticles.push({
            id: article.id,
            title: article.title,
            category: cat.name,
            relevanceScore,
            content: article.content
          });
        }
      });
    });
    
    // 按相关性排序
    relatedArticles.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    // 获取最相关的内容
    if (relatedArticles.length > 0) {
      mostRelevantContent = relatedArticles[0].content;
    }
    
    // 生成回答
    let answer = '';
    
    if (mostRelevantContent) {
      // 使用最相关文章的内容生成回答
      answer = mostRelevantContent;
    } else {
      // 如果没有找到相关内容，提供通用回答
      answer = '这是一个关于装修的重要问题。建议您咨询专业的装修公司或设计师，以获取针对您具体情况的建议。装修是一项复杂的工程，需要考虑多方面因素，包括预算、风格、材料选择、施工质量等。';
    }
    
    // 简化相关文章列表（只保留id、title和category）
    const simplifiedArticles = relatedArticles.map(({ id, title, category }) => ({
      id,
      title,
      category
    })).slice(0, 3); // 只返回前3篇
    
    return {
      answer,
      relatedArticles: simplifiedArticles,
      message: simplifiedArticles.length > 0 
        ? `找到${simplifiedArticles.length}篇相关文章供参考。` 
        : '没有找到与问题直接相关的文章。'
    };
  }
});
