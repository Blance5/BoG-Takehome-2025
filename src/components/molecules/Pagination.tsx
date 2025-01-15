import { PaginationProps } from '@/lib/types/props/pagination';
import { RightArrowIcon } from '../icons/RightArrowIcon';
import { LeftArrowIcon } from '../icons/LeftArrowIcon';

const ArrowButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <div
    className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-stroke bg-gray-fill-light p-1"
    onClick={onClick}
  >
    {children}
  </div>
);

export default function Pagination({
  pageNumber,
  pageSize,
  totalRecords,
  onPageChange,
}: PaginationProps) {
  const firstRecordOnPage = (pageNumber - 1) * pageSize + 1;
  const lastRecordOnPage = Math.min(
    firstRecordOnPage + pageSize - 1,
    totalRecords,
  );

  const isValidPage =
    firstRecordOnPage > 0 && firstRecordOnPage <= totalRecords;

  if (!isValidPage) {
    return <></>;
  }

  return (
    <div className="inline-flex items-center justify-start gap-4 text-gray-text">
      {firstRecordOnPage} - {lastRecordOnPage} of {totalRecords}
      <div className="inline-flex gap-2">
        {firstRecordOnPage > 1 && (
          <ArrowButton
            onClick={() => {
              onPageChange(pageNumber - 1);
            }}
          >
            <LeftArrowIcon />
          </ArrowButton>
        )}
        {lastRecordOnPage < totalRecords && (
          <ArrowButton
            onClick={() => {
              onPageChange(pageNumber + 1);
            }}
          >
            <RightArrowIcon />
          </ArrowButton>
        )}
      </div>
    </div>
  );
}
