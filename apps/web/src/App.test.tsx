import { describe, it, expect } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('导出可渲染的ログイン入口组件', () => {
    expect(typeof App).toBe('function');
  });
});
