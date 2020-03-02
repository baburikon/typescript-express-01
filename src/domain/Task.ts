import { v4 as uuid } from 'uuid';
import ITaskNewInput from '../services/ITaskNewInput';

/**
 *
 */
export default class Task {

  readonly id: string;
  title: string;
  priority: number;

  /**
   *
   * @param id
   * @param title
   * @param priority
   */
  constructor({
    id,
    title,
    priority = 0
  }: ITaskNewInput) {
    this.id = id || uuid();
    this.title = title;
    this.priority = priority;
  }

}
