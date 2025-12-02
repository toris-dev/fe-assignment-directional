import { useState, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnSizingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { POST_CATEGORIES, CATEGORY_COLORS } from "../constants";
import { formatDateShort } from "../utils/date";
import type { Post } from "../types";
import "./PostTable.css";

interface PostTableProps {
  posts: Post[];
  onRowClick?: (post: Post) => void;
}

/**
 * 게시글 테이블 컴포넌트
 * - 컬럼 넓이 조절 가능
 * - 컬럼 숨김/보임 기능
 * - 정렬 기능
 * - 검색 및 필터 기능
 */
// useReactTable을 사용하는 내부 컴포넌트를 분리하여 React Compiler 경고를 해결
const PostTableInner = ({
  posts,
  onRowClick,
  columns,
}: {
  posts: Post[];
  onRowClick?: (post: Post) => void;
  columns: ColumnDef<Post>[];
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: posts,
    columns,
    state: {
      sorting,
      columnSizing,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnSizingChange: setColumnSizing,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableColumnResizing: false,
    defaultColumn: {
      size: 100,
      minSize: 50,
      maxSize: 500,
    },
  });

  const toggleColumnVisibility = useCallback((columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  }, []);

  return (
    <div className="post-table-container">
      {/* 컬럼 가시성 컨트롤 */}
      <div className="column-visibility-controls">
        <div className="visibility-header">
          <span className="visibility-icon">👁️</span>
          <span className="visibility-title">컬럼 표시/숨김</span>
        </div>
        <div className="visibility-buttons">
          {table.getAllColumns().map((column) => {
            const columnDef = column.columnDef;
            const headerLabel =
              typeof columnDef.header === "string"
                ? columnDef.header
                : column.id;
            return (
              <label key={column.id} className="visibility-checkbox">
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={() => toggleColumnVisibility(column.id)}
                />
                <span>{headerLabel}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 테이블 */}
      <div className="table-wrapper">
        {posts.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
            표시할 데이터가 없습니다.
          </div>
        ) : (
          <table className="post-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={header.column.getCanSort() ? "sortable" : ""}
                    >
                      <div
                        onClick={header.column.getToggleSortingHandler()}
                        style={{
                          cursor: header.column.getCanSort()
                            ? "pointer"
                            : "default",
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " ↑",
                          desc: " ↓",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={onRowClick ? "clickable-row" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const PostTable = ({ posts, onRowClick }: PostTableProps) => {
  const columns = useMemo<ColumnDef<Post>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 100,
        enableResizing: false,
        minSize: 80,
        maxSize: 120,
      },
      {
        accessorKey: "title",
        header: "제목",
        size: 200,
        enableResizing: false,
        minSize: 150,
        maxSize: 300,
      },
      {
        accessorKey: "body",
        header: "본문",
        size: 300,
        enableResizing: false,
        minSize: 200,
        maxSize: 400,
        cell: (info) => {
          const body = info.getValue() as string;
          return body.length > 50 ? `${body.substring(0, 50)}...` : body;
        },
      },
      {
        accessorKey: "category",
        header: "카테고리",
        size: 120,
        enableResizing: false,
        minSize: 100,
        maxSize: 150,
        cell: (info) => {
          const category = info.getValue() as string;
          const label =
            POST_CATEGORIES[category as keyof typeof POST_CATEGORIES] ||
            category;
          const color =
            CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] ||
            "#718096";
          return (
            <span
              className="category-badge"
              style={{ "--category-color": color } as React.CSSProperties}
            >
              {label}
            </span>
          );
        },
      },
      {
        accessorKey: "tags",
        header: "태그",
        size: 200,
        enableResizing: false,
        minSize: 150,
        maxSize: 250,
        cell: (info) => {
          const tags = info.getValue() as string[];
          if (tags.length === 0)
            return <span style={{ color: "#cbd5e0" }}>-</span>;
          return (
            <div className="tags-cell">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="tag-badge">
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="tag-more">+{tags.length - 3}</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "작성일",
        size: 180,
        enableResizing: false,
        minSize: 150,
        maxSize: 200,
        cell: (info) => {
          const dateString = info.getValue() as string;
          return formatDateShort(dateString);
        },
      },
    ],
    []
  );

  return (
    <PostTableInner posts={posts} onRowClick={onRowClick} columns={columns} />
  );
};

export default PostTable;
