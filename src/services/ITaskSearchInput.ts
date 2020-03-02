/**
 *
 */
export default interface ITaskSearchInput {
  sorting?: { field: string; order: string }[];
  offset?: number;
  limit?: number;
}
