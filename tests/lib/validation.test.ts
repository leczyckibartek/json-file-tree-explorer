import { describe, expect, it } from 'vitest'
import { parseDirectoryTreeJsonText } from '@/lib/validation'

describe('parseDirectoryTreeJsonText', () => {
	it('parses a minimal valid folder tree', () => {
		const json = JSON.stringify({
			name: 'project',
			type: 'folder',
			children: [
				{ name: 'readme.txt', type: 'file', size: 42 },
			],
		})
		expect(parseDirectoryTreeJsonText(json)).toEqual({
			name: 'project',
			type: 'folder',
			children: [
				{ name: 'readme.txt', type: 'file', size: 42 },
			],
		})
	})

	it('rejects empty or whitespace-only input', () => {
		expect(parseDirectoryTreeJsonText('')).toBe('Paste or upload non-empty JSON.')
		expect(parseDirectoryTreeJsonText('   \n\t  ')).toBe(
			'Paste or upload non-empty JSON.',
		)
	})

	it('rejects invalid JSON syntax', () => {
		expect(parseDirectoryTreeJsonText('{')).toBe(
			'Could not parse JSON (invalid syntax).',
		)
	})

	it('rejects root that is not a plain object', () => {
		expect(parseDirectoryTreeJsonText('[]')).toBe(
			'Document root: Node "root" must be a JSON object.',
		)
		expect(parseDirectoryTreeJsonText('"string"')).toBe(
			'Document root: Node "root" must be a JSON object.',
		)
	})

	it('rejects root with wrong node type', () => {
		const json = JSON.stringify({
			name: 'x',
			type: 'file',
			size: 1,
		})
		expect(parseDirectoryTreeJsonText(json)).toBe(
			'Document root: Node "root" has an unsupported type (expected type: "folder").',
		)
	})

	it('rejects file missing or empty name', () => {
		const missingName = JSON.stringify({
			name: 'root',
			type: 'folder',
			children: [{ type: 'file', size: 1 }],
		})
		expect(parseDirectoryTreeJsonText(missingName)).toBe(
			'Document root: File at "root[0]" must have a non-empty name (string).',
		)

		const emptyName = JSON.stringify({
			name: 'root',
			type: 'folder',
			children: [{ name: '', type: 'file', size: 1 }],
		})
		expect(parseDirectoryTreeJsonText(emptyName)).toBe(
			'Document root: File at "root[0]" must have a non-empty name (string).',
		)
	})

	it('rejects file when size is not a finite number', () => {
		for (const size of [NaN, Number.POSITIVE_INFINITY]) {
			const json = JSON.stringify({
				name: 'root',
				type: 'folder',
				children: [{ name: 'a.txt', type: 'file', size }],
			})
			expect(parseDirectoryTreeJsonText(json)).toBe(
				'Document root: File "a.txt" at "root[0]" must have a finite numeric size.',
			)
		}
	})

	it('rejects file name containing slash', () => {
		const json = JSON.stringify({
			name: 'root',
			type: 'folder',
			children: [{ name: 'a/b', type: 'file', size: 1 }],
		})
		expect(parseDirectoryTreeJsonText(json)).toBe(
			'Document root: File name "a/b" at "root[0]" must not contain "/".',
		)
	})

	it('rejects folder without children array', () => {
		const missingChildren = JSON.stringify({
			name: 'root',
			type: 'folder',
		})
		expect(parseDirectoryTreeJsonText(missingChildren)).toBe(
			'Document root: Folder "root" at "root" must have a children array.',
		)

		const childrenNotArray = JSON.stringify({
			name: 'root',
			type: 'folder',
			children: {},
		})
		expect(parseDirectoryTreeJsonText(childrenNotArray)).toBe(
			'Document root: Folder "root" at "root" must have a children array.',
		)
	})

	it('rejects duplicate sibling names', () => {
		const json = JSON.stringify({
			name: 'root',
			type: 'folder',
			children: [
				{ name: 'dup', type: 'file', size: 1 },
				{ name: 'dup', type: 'file', size: 2 },
			],
		})
		expect(parseDirectoryTreeJsonText(json)).toBe(
			'Document root: Folder "root" at "root" has duplicate child name "dup". Sibling names must be unique.',
		)
	})

	it('prefixes nested validation errors with Document root and path segments', () => {
		const json = JSON.stringify({
			name: 'a',
			type: 'folder',
			children: [
				{
					name: 'b',
					type: 'folder',
					children: [{ type: 'file', size: 1 }],
				},
			],
		})
		const message = parseDirectoryTreeJsonText(json)
		expect(message).toMatch(/^Document root: /)
		expect(message).toContain('a[0]')
		expect(message).toContain('b[0]')
		expect(message).toContain('non-empty name')
	})
})
