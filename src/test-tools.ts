import { companyDatabaseTool, budgetCalculatorTool, knowledgeBaseTool } from './mastra/tools';

async function main() {
  try {
    console.log('🏠 测试装修工具...');

    // 测试公司数据库工具
    console.log('\n1. 测试公司数据库工具:');
    const companyResult = await companyDatabaseTool.execute({
      context: {
        location: '北京',
        limit: 3
      }
    });

    console.log('查询结果:', JSON.stringify(companyResult, null, 2));

    // 测试预算计算工具
    console.log('\n2. 测试预算计算工具:');
    const budgetResult = await budgetCalculatorTool.execute({
      context: {
        roomSize: 90,
        renovationScope: 'full',
        materialQuality: 'medium',
        location: '北京',
        additionalFeatures: ['智能家居']
      }
    });

    console.log('预算结果:', JSON.stringify(budgetResult, null, 2));

    // 测试知识库工具
    console.log('\n3. 测试知识库工具:');
    const knowledgeResult = await knowledgeBaseTool.execute({
      context: {
        query: '装修流程',
        category: '装修流程'
      }
    });

    console.log('知识查询结果:', JSON.stringify(knowledgeResult, null, 2));

    console.log('\n🏁 测试完成！');
  } catch (error) {
    console.error('❌ 错误：', error);
    throw error;
  }
}

// 运行主函数并处理错误
main().catch(error => {
  console.error('❌ 错误：', error);
  process.exit(1);
});
