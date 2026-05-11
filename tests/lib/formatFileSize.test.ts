import { describe, expect, it } from 'vitest'
import { formatFileSize } from '@/lib/formatFileSize'

describe('formatFileSize', () => {
	it('formats zero bytes', () => {
		expect(formatFileSize(0)).toBe('0 B')
	})

	it('formats values strictly below 1 KiB as B', () => {
		expect(formatFileSize(1)).toBe('1 B')
		expect(formatFileSize(1023)).toBe('1023 B')
	})

	it('formats 1024 B as 1.00 KB', () => {
		expect(formatFileSize(1024)).toBe('1.00 KB')
	})

	it('formats values between 1 KiB and 1 MiB as KB with two decimals', () => {
		expect(formatFileSize(1536)).toBe('1.50 KB')
		expect(formatFileSize(1024 * 1024 - 1)).toBe('1024.00 KB')
	})

	it('formats one mebibyte and larger as MB with two decimals', () => {
		expect(formatFileSize(1024 * 1024)).toBe('1.00 MB')
		expect(formatFileSize(5 * 1024 * 1024)).toBe('5.00 MB')
		expect(formatFileSize(1024 * 1024 * 1024)).toBe('1024.00 MB')
	})
})
