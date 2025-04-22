import { mastra } from './mastra/index';

async function main() {
  // 调试信息
  console.log('Mastra对象类型:', typeof mastra);
  console.log('Mastra属性:', Object.keys(mastra));

  try {
    console.log('🏠 启动家装助手...');

    // 直接访问网络对象
    const renovationNetwork = mastra.networks?.renovationNetwork;

    if (!renovationNetwork) {
      console.log('尝试使用getNetwork方法...');
      if (typeof mastra.getNetwork === 'function') {
        const network = mastra.getNetwork('renovationNetwork');
        if (!network) {
          throw new Error('装修网络未找到');
        }
        console.log('成功获取网络!');
        return runTest(network);
      } else {
        throw new Error('装修网络未找到，且getNetwork方法不存在');
      }
    } else {
      console.log('成功获取网络!');
      return runTest(renovationNetwork);
    }
  } catch (error) {
    console.error('获取网络失败:', error);
    throw error;
  }
}

async function runTest(renovationNetwork) {
  console.log('\n开始测试装修网络...');

  // 示例交互
  const result = await renovationNetwork.stream('我想在北京装修一个90平方米的新房，预算大概是20万，能给我推荐一些装修公司吗？', {
    maxSteps: 20, // 允许足够的步骤让LLM路由器确定使用哪些代理
  });

  for await (const part of result.fullStream) {
    switch (part.type) {
      case 'error':
        console.error(part.error);
        break;
      case 'text-delta':
        process.stdout.write(part.textDelta);
        break;
      case 'tool-call':
        console.log(`\n调用工具 ${part.toolName} 参数：${JSON.stringify(part.args, null, 2)}`);
        break;
      case 'tool-result':
        console.log(`\n工具结果：${JSON.stringify(part.result, null, 2)}`);
        break;
    }
  }

  console.log('\n\n📊 代理交互摘要：');
  console.log(renovationNetwork.getAgentInteractionSummary());

  console.log('\n🏁 会话完成！');
}

// 运行主函数并处理错误
main().catch(error => {
  console.error('❌ 错误：', error);
  process.exit(1);
});
