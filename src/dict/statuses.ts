import { Status as StatusEnum } from "@services/types";
import type { Status } from "@dict/types";

const statuses: Status[] = [
  {
    id: StatusEnum.Created,
    marker: "status.created",
  },
  {
    id: StatusEnum.Pending,
    marker: "status.pending",
  },
  {
    id: StatusEnum.Processing,
    marker: "status.processing",
  },
  {
    id: StatusEnum.Done,
    marker: "status.done",
  },
  {
    id: StatusEnum.Error,
    marker: "status.error",
  },
];

export default statuses;
