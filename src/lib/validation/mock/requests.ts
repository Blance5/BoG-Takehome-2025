/* eslint-disable @typescript-eslint/no-explicit-any */
// ^ disable rules because we are validating anys to make sure it conforms else erroring
import {
  MockCreateItemRequest,
  MockEditStatusRequest,
} from '@/lib/types/mock/request';
import { RequestStatus } from '@/lib/types/request';

function isValidMockString(str: any, lower?: number, upper?: number): boolean {
  if (typeof str !== 'string' || str.trim() == '') {
    return false;
  }
  if ((lower && str.length < lower) || (upper && str.length > upper)) {
    return false;
  }
  return true;
}

function isValidMockName(name: string): boolean {
  return isValidMockString(name, 3, 30);
}

function isValidMockItemRequested(item: string): boolean {
  return isValidMockString(item, 2, 100);
}

export function isValidMockStatus(status: any): boolean {
  return (
    isValidMockString(status) &&
    Object.values(RequestStatus).includes(status as RequestStatus)
  );
}

export function isValidMockId(id: any): boolean {
  return typeof id === 'number' && id > 0;
}

export function validateMockCreateItemRequest(
  request: any,
): MockCreateItemRequest | null {
  if (!request.requestorName || !request.itemRequested) {
    return null;
  }
  if (
    !isValidMockName(request.requestorName) ||
    !isValidMockItemRequested(request.itemRequested)
  ) {
    return null;
  }
  const newCreateItemRequest: MockCreateItemRequest = {
    requestorName: request.requestorName,
    itemRequested: request.itemRequested,
  };
  return newCreateItemRequest;
}

export function validateMockEditStatusRequest(
  request: any,
): MockEditStatusRequest | null {
  if (!request.id || !request.status) {
    return null;
  }
  if (!isValidMockId(request.id) || !isValidMockStatus(request.status)) {
    return null;
  }
  const newEditStatusRequest: MockEditStatusRequest = {
    id: request.id,
    status: request.status,
  };
  return newEditStatusRequest;
}
