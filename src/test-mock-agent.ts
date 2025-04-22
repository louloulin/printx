import { mastra } from './mastra';

async function main() {
  try {
    console.log('🏠 启动家装助手...');
    
    // 获取模拟代理
    const mockAgent = mastra.getAgent('mockAgent');
    
    if (!mockAgent) {
      throw new Error('模拟代理未找到');
    }
    
    console.log('成功获取模拟代理!');
    
    // 示例交互
    const result = await mockAgent.stream('我想在北京装修一个90平方米的新房，预算大概是20万，能给我推荐一些装修公司吗？');
    
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
    
    console.log('\n🏁 会话完成！');
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
