import { Agent } from '@mastra/core/agent';
import { companyDatabaseTool, companyReviewTool } from '../tools';

// 创建一个简单的模拟模型
const mockModel = {
  doStream: async ({ messages }) => {
    // 模拟响应
    const mockResponse = {
      role: 'assistant',
      content: '这是一个模拟响应。我是装修助手，可以帮助您解决装修相关问题。'
    };
    
    // 模拟工具调用
    if (messages[messages.length - 1].content.includes('推荐') && messages[messages.length - 1].content.includes('公司')) {
      return {
        fullStream: (async function* () {
          // 模拟工具调用
          yield {
            type: 'tool-call',
            toolName: 'queryCompanyDatabase',
            args: {
              location: '北京',
              limit: 3
            }
          };
          
          // 等待一下，模拟API调用
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // 模拟工具结果
          const toolResult = {
            companies: [
              {
                id: '1',
                name: '北京家装一号',
                location: '北京',
                specializations: ['全屋装修', '厨房', '卫生间'],
                priceRange: '中高端',
                rating: 4.7,
                reviewCount: 1250
              },
              {
                id: '2',
                name: '北京现代装饰',
                location: '北京',
                specializations: ['全屋装修', '别墅装修'],
                priceRange: '高端',
                rating: 4.9,
                reviewCount: 980
              },
              {
                id: '3',
                name: '北京家居美',
                location: '北京',
                specializations: ['全屋装修', '小户型改造'],
                priceRange: '中端',
                rating: 4.5,
                reviewCount: 820
              }
            ],
            totalResults: 3,
            message: '找到3家符合条件的装修公司，显示前3家。'
          };
          
          yield {
            type: 'tool-result',
            result: toolResult
          };
          
          // 模拟文本响应
          const response = `
根据您的需求，我为您找到了3家北京地区的装修公司：

1. **北京家装一号**
   - 价格范围：中高端
   - 专业领域：全屋装修、厨房、卫生间
   - 评分：4.7/5（基于1250条评价）
   
2. **北京现代装饰**
   - 价格范围：高端
   - 专业领域：全屋装修、别墅装修
   - 评分：4.9/5（基于980条评价）
   
3. **北京家居美**
   - 价格范围：中端
   - 专业领域：全屋装修、小户型改造
   - 评分：4.5/5（基于820条评价）

考虑到您90平方米的新房和20万的预算，我建议您优先考虑"北京家居美"，因为它的价格范围是中端，更符合您的预算要求。如果您希望获得更高品质的装修，且预算有一定弹性，"北京家装一号"也是不错的选择。

您需要了解这些公司的更多详细信息吗？或者您对某个公司特别感兴趣，想了解更多评价？
          `;
          
          // 逐字输出响应
          for (const char of response) {
            yield {
              type: 'text-delta',
              textDelta: char
            };
            // 模拟打字速度
            await new Promise(resolve => setTimeout(resolve, 10));
          }
        })(),
        completion: mockResponse
      };
    } else {
      return {
        fullStream: (async function* () {
          const response = '您好！我是装修助手，可以帮助您解决装修相关问题。请问您有什么具体的装修需求或问题需要咨询吗？';
          
          // 逐字输出响应
          for (const char of response) {
            yield {
              type: 'text-delta',
              textDelta: char
            };
            // 模拟打字速度
            await new Promise(resolve => setTimeout(resolve, 10));
          }
        })(),
        completion: mockResponse
      };
    }
  }
};

// 创建一个模拟代理，不依赖于外部API
export const mockAgent = new Agent({
  name: '装修模拟代理',
  instructions: `
    你是一个装修助手，可以回答用户关于装修的各种问题。
  `,
  // 使用内置的模拟模型
  model: mockModel,
  tools: {
    companyDatabaseTool,
    companyReviewTool
  }
});
