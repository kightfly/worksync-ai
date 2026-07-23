import { describe, expect, it } from 'vitest'
import { Task, TaskDomainError } from './task.js'

describe('Task', () => {
  it('新規作成時 status は todo である', () => {
    const task = Task.create({ title: '報告書作成', userId: 'u1' })
    expect(task.status).toBe('todo')
    expect(task.title).toBe('報告書作成')
  })

  it('タイトルが空のとき作成に失敗する', () => {
    expect(() => Task.create({ title: '   ', userId: 'u1' })).toThrow(TaskDomainError)
  })

  it('todo から in_progress へ遷移できる', () => {
    const task = Task.create({ title: 'A', userId: 'u1' })
    task.transitionTo('in_progress')
    expect(task.status).toBe('in_progress')
  })

  it('in_progress から done へ遷移できる', () => {
    const task = Task.create({ title: 'A', userId: 'u1' })
    task.transitionTo('in_progress')
    task.transitionTo('done')
    expect(task.status).toBe('done')
  })

  it('in_progress から todo へ戻せる', () => {
    const task = Task.create({ title: 'A', userId: 'u1' })
    task.transitionTo('in_progress')
    task.transitionTo('todo')
    expect(task.status).toBe('todo')
  })

  it('todo から done への遷移は INVALID_STATE_TRANSITION', () => {
    const task = Task.create({ title: 'A', userId: 'u1' })
    try {
      task.transitionTo('done')
      expect.fail('should throw')
    } catch (e) {
      expect(e).toBeInstanceOf(TaskDomainError)
      const err = e as TaskDomainError
      expect(err.code).toBe('INVALID_STATE_TRANSITION')
      expect(err.message).toBe('無効な状態遷移です')
    }
  })

  it('done から任意への遷移は拒否される', () => {
    const task = Task.restore({
      id: 't1',
      userId: 'u1',
      title: 'A',
      description: null,
      status: 'done',
      dueDate: null,
    })
    expect(() => task.transitionTo('todo')).toThrow(TaskDomainError)
  })

  it('done タスクのタイトル更新は拒否される', () => {
    const task = Task.restore({
      id: 't1',
      userId: 'u1',
      title: 'A',
      description: null,
      status: 'done',
      dueDate: null,
    })
    expect(() => task.updateContent({ title: 'B' })).toThrow(TaskDomainError)
  })

  it('非 done タスクのタイトルを更新できる', () => {
    const task = Task.create({ title: 'A', userId: 'u1' })
    task.updateContent({ title: 'B', description: 'メモ' })
    expect(task.title).toBe('B')
    expect(task.description).toBe('メモ')
  })
})
