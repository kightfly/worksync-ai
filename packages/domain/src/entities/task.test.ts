import { describe, it, expect } from 'vitest';
import { Task } from './task.js';
import { InvalidStateTransitionError } from '../errors/invalid-state-transition-error.js';
import { TaskLockedError } from '../errors/task-locked-error.js';

const USER_ID = 'user-1';

describe('Task.create', () => {
  it('タイトル必須で作成し、初期状態は todo', () => {
    const task = Task.create({ userId: USER_ID, title: '  タスク 1  ' });
    expect(task.title).toBe('タスク 1');
    expect(task.status).toBe('todo');
    expect(task.userId).toBe(USER_ID);
  });

  it('タイトルが空の場合はエラー', () => {
    expect(() => Task.create({ userId: USER_ID, title: '   ' })).toThrow(
      'タイトルは必須です',
    );
  });
});

describe('Task.transitionTo', () => {
  it('todo から in_progress に遷移できる', () => {
    const task = Task.create({ userId: USER_ID, title: 'A' });
    task.transitionTo('in_progress');
    expect(task.status).toBe('in_progress');
  });

  it('in_progress から done に遷移できる', () => {
    const task = Task.create({ userId: USER_ID, title: 'A' });
    task.transitionTo('in_progress');
    task.transitionTo('done');
    expect(task.status).toBe('done');
  });

  it('in_progress から todo に戻せる', () => {
    const task = Task.create({ userId: USER_ID, title: 'A' });
    task.transitionTo('in_progress');
    task.transitionTo('todo');
    expect(task.status).toBe('todo');
  });

  it('todo から done への直接遷移は拒否する', () => {
    const task = Task.create({ userId: USER_ID, title: 'A' });
    expect(() => task.transitionTo('done')).toThrow(InvalidStateTransitionError);
    expect(() => task.transitionTo('done')).toThrow('無効な状態遷移です');
    expect(task.status).toBe('todo');
  });

  it('done から他状態への遷移は拒否する', () => {
    const task = Task.create({ userId: USER_ID, title: 'A' });
    task.transitionTo('in_progress');
    task.transitionTo('done');
    expect(() => task.transitionTo('todo')).toThrow(InvalidStateTransitionError);
    expect(() => task.transitionTo('in_progress')).toThrow(InvalidStateTransitionError);
    expect(task.status).toBe('done');
  });
});

describe('Task content updates', () => {
  it('todo 状態でタイトルと説明を更新できる', () => {
    const task = Task.create({ userId: USER_ID, title: 'A', description: null });
    task.updateTitle('B');
    task.updateDescription('説明');
    expect(task.title).toBe('B');
    expect(task.description).toBe('説明');
  });

  it('done 状態では内容を変更できない', () => {
    const task = Task.create({ userId: USER_ID, title: 'A' });
    task.transitionTo('in_progress');
    task.transitionTo('done');
    expect(() => task.updateTitle('B')).toThrow(TaskLockedError);
    expect(() => task.updateDescription('x')).toThrow('完了したタスクは変更できません');
    expect(task.title).toBe('A');
  });
});
