'use client';

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const canPrevious = currentPage > 1;
    const canNext = currentPage < totalPages;

    const handlePrevious = () => {
        if (canPrevious) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (canNext) {
            onPageChange(currentPage + 1);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={currentPage === i ? "default" : "ghost"}
                    size="icon"
                    onClick={() => onPageChange(i)}
                    className={cn(
                        "h-8 w-8",
                        currentPage === i
                            ? "bg-orange-500 text-black hover:bg-orange-400"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                    )}
                >
                    {i}
                </Button>
            );
        }

        if (startPage > 1) {
            pages.unshift(
                <span key="start-ellipsis" className="text-zinc-600 px-1">...</span>
            );
            pages.unshift(
                <Button
                    key={1}
                    variant="ghost"
                    size="icon"
                    onClick={() => onPageChange(1)}
                    className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                    1
                </Button>
            );
        }

        if (endPage < totalPages) {
            pages.push(
                <span key="end-ellipsis" className="text-zinc-600 px-1">...</span>
            );
            pages.push(
                <Button
                    key={totalPages}
                    variant="ghost"
                    size="icon"
                    onClick={() => onPageChange(totalPages)}
                    className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                    {totalPages}
                </Button>
            );
        }

        return pages;
    };

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="flex items-center space-x-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 text-zinc-400 disabled:opacity-50 hover:text-white hover:bg-zinc-800"
                    onClick={() => onPageChange(1)}
                    disabled={!canPrevious}
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 text-zinc-400 disabled:opacity-50 hover:text-white hover:bg-zinc-800"
                    onClick={handlePrevious}
                    disabled={!canPrevious}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1 mx-2">
                    {renderPageNumbers()}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 text-zinc-400 disabled:opacity-50 hover:text-white hover:bg-zinc-800"
                    onClick={handleNext}
                    disabled={!canNext}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 text-zinc-400 disabled:opacity-50 hover:text-white hover:bg-zinc-800"
                    onClick={() => onPageChange(totalPages)}
                    disabled={!canNext}
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
