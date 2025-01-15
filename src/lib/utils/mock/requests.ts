import { MockItemRequest } from '@/lib/types/mock/request';

export function generateMockId(requests: MockItemRequest[]): number {
  return requests.length > 0
    ? Math.max(...requests.map((req) => req.id)) + 1
    : 1;
}

export function sortMockItemRequests(
  requests: MockItemRequest[],
): MockItemRequest[] {
  return requests.sort(
    (a, b) => b.requestCreatedDate.getTime() - a.requestCreatedDate.getTime(),
  );
}
