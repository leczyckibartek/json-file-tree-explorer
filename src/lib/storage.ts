import type { FolderNode } from '@/lib/types'
import { parseDirectoryTreeJsonText } from '@/lib/validation'

const JSON_TEXT_KEY = "json-file-tree-explorer:directory-json"

export type LoadTreeResult =
	| { status: "empty" }
	| { status: "invalid"; message: string }
	| { status: "ok"; tree: FolderNode }

export function loadJsonText(): string {
	if (typeof window === "undefined") {
		return ""
	}
	try {
		return localStorage.getItem(JSON_TEXT_KEY) ?? ""
	}
	catch {
		return ""
	}
}

export function saveJsonText(text: string): void {
	if (typeof window === "undefined") {
		return
	}
	try {
		localStorage.setItem(JSON_TEXT_KEY, text)
	}
	catch {
		// ignore
	}
}

export function loadTreeFromStorage(): LoadTreeResult {
	const text = loadJsonText()
	if (text.trim().length === 0) {
		return { status: "empty" }
	}
	const outcome = parseDirectoryTreeJsonText(text)
	if (typeof outcome === "string") {
		return { status: "invalid", message: outcome }
	}
	return { status: "ok", tree: outcome }
}
