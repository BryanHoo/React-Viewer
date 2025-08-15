import { nanoid } from 'nanoid';

/**
 * 生成带有可选前缀的随机唯一 ID
 * @param prefix - 可选，ID 前缀，默认为空字符串
 * @param size - 可选，ID 随机部分长度，默认为 21（nanoid 默认长度）
 * @returns 拼接前缀后的唯一 ID 字符串
 */
export function generateId(prefix: string = '', size: number = 21): string {
  return prefix + nanoid(size);
}
