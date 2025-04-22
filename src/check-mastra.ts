import { mastra } from './mastra/index';

// 检查mastra对象
console.log('Mastra对象类型:', typeof mastra);
console.log('Mastra属性:', Object.keys(mastra));
console.log('Mastra详细信息:', mastra);

// 检查agents
console.log('\n代理信息:');
if (mastra.agents) {
  console.log('可用代理:', Object.keys(mastra.agents));
} else {
  console.log('没有找到代理');
}

// 检查networks
console.log('\n网络信息:');
if (mastra.networks) {
  console.log('可用网络:', Object.keys(mastra.networks));
} else {
  console.log('没有找到网络');
}

// 检查方法
console.log('\n方法信息:');
console.log('getNetwork方法:', typeof mastra.getNetwork);
console.log('getAgent方法:', typeof mastra.getAgent);
