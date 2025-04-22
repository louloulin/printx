import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// 网络搜索工具
export const webSearchTool = createTool({
  id: 'searchWeb',
  description: '搜索网络获取装修相关信息，包括最新的装修趋势、材料价格、装修公司评价等',
  inputSchema: z.object({
    query: z.string().describe('搜索查询词'),
    limit: z.number().optional().default(5).describe('返回结果数量限制')
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
        snippet: z.string()
      })
    ),
    message: z.string()
  }),
  execute: async ({ context }) => {
    const { query, limit = 5 } = context;
    
    // 注意：这是一个模拟的网络搜索结果
    // 在实际应用中，应该使用真实的搜索API，如Google Custom Search API或Bing Search API
    
    // 模拟搜索结果
    const mockResults = [
      {
        title: '2024年最新家装设计趋势',
        url: 'https://example.com/design-trends-2024',
        snippet: '2024年家装设计趋势包括：1. 自然材质的回归；2. 多功能空间设计；3. 智能家居集成；4. 可持续环保材料；5. 复古元素与现代设计的融合。'
      },
      {
        title: '如何选择靠谱的装修公司 - 专业指南',
        url: 'https://example.com/choose-renovation-company',
        snippet: '选择装修公司的关键因素：查看资质证书、实地考察案例、了解施工团队、明确合同条款、询问售后服务。本文提供详细的筛选步骤和注意事项。'
      },
      {
        title: '装修预算控制技巧 - 避免超支的10个方法',
        url: 'https://example.com/budget-control-tips',
        snippet: '装修超支是常见问题，本文分享10个有效控制预算的方法：合理规划、材料分级、避免返工、控制设计变更、自行采购主材等。'
      },
      {
        title: '小户型装修攻略 - 空间利用最大化',
        url: 'https://example.com/small-apartment-renovation',
        snippet: '小户型装修需要注重空间利用，本文介绍多功能家具选择、色彩搭配、收纳设计、光线利用等方面的专业建议，让小空间也能舒适宜居。'
      },
      {
        title: '装修材料环保指南 - 如何选择健康材料',
        url: 'https://example.com/eco-friendly-materials',
        snippet: '装修材料的环保性直接关系到居住健康，本文详细介绍各类装修材料的环保标准、检测方法，以及如何识别真正的环保材料。'
      },
      {
        title: '2024年各地区装修价格参考',
        url: 'https://example.com/renovation-price-2024',
        snippet: '最新整理的全国各地区装修价格参考，包括一线城市、二线城市和三四线城市的装修成本对比，以及不同档次装修的价格区间。'
      },
      {
        title: '装修合同签订注意事项 - 法律专家建议',
        url: 'https://example.com/renovation-contract-tips',
        snippet: '装修合同是保障业主权益的重要文件，本文由法律专家提供签订装修合同时的注意事项，包括条款解读、常见陷阱和维权方法。'
      },
      {
        title: '装修后除甲醛最有效的方法',
        url: 'https://example.com/remove-formaldehyde',
        snippet: '新装修房屋的甲醛问题令人担忧，本文科学分析各种除甲醛方法的有效性，并提供实用的室内空气净化建议。'
      },
      {
        title: '装修施工监理指南 - 如何确保装修质量',
        url: 'https://example.com/renovation-supervision',
        snippet: '业主如何做好装修监理？本文详细介绍各个装修阶段的监理要点、验收标准，以及常见问题的处理方法，帮助业主确保装修质量。'
      },
      {
        title: '智能家居系统选购指南2024',
        url: 'https://example.com/smart-home-guide-2024',
        snippet: '2024年智能家居系统比较，包括主流品牌功能对比、兼容性分析、安装难度和价格区间，帮助业主选择适合自己的智能家居解决方案。'
      }
    ];
    
    // 根据查询词筛选结果（简单实现）
    const filteredResults = mockResults.filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) || 
      result.snippet.toLowerCase().includes(query.toLowerCase())
    );
    
    // 如果没有匹配结果，返回所有结果
    const searchResults = filteredResults.length > 0 ? filteredResults : mockResults;
    
    // 限制结果数量
    const limitedResults = searchResults.slice(0, limit);
    
    return {
      results: limitedResults,
      message: `找到${searchResults.length}条与"${query}"相关的结果，显示前${limitedResults.length}条。`
    };
  }
});
