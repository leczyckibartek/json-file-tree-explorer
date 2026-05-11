import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import JsonFileUpload from '@/components/JsonFileUpload'
import { exampleDirectoryTree } from '@/data/exampleDirectoryTree'
import type { FolderNode } from '@/lib/types'
import { loadJsonText, saveJsonText } from '@/lib/storage'
import { parseDirectoryTreeJsonText } from '@/lib/validation'

export default function JsonInput() {

	const navigate = useNavigate()

	const [jsonText, setJsonText] = useState(loadJsonText)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		saveJsonText(jsonText)
	}, [jsonText])

	const parsed = useMemo(
		() => (jsonText.trim() ? parseDirectoryTreeJsonText(jsonText) : null),
		[jsonText]
	)
	const tree: FolderNode | null =
		parsed !== null && typeof parsed !== 'string' ? parsed : null
	const parseError = typeof parsed === 'string' ? parsed : null
	const visibleError = error ?? parseError

	const applyJsonText = (text: string) => {
		setError(null)
		setJsonText(text)
	}

	return (
		<div>
			<label htmlFor="json-input" className="vscode-kv-label vscode-label-block">JSON input</label>
			<textarea
				id="json-input"
				spellCheck={false}
				value={jsonText}
				onChange={(event) => applyJsonText(event.target.value)}
				rows={18}
				className="vscode-editor-textarea"
			/>

			{visibleError && (
				<div role="alert" className="vscode-alert">{visibleError}</div>
			)}

			<div className="vscode-editor-toolbar">
				<button
					type="button"
					className="vscode-btn vscode-btn-secondary"
					onClick={() => applyJsonText(JSON.stringify(exampleDirectoryTree, null, 2))}
				>
					Load example
				</button>
				<JsonFileUpload
					onLoaded={applyJsonText}
					onReadError={setError}
				/>
				<button
					type="button"
					className="vscode-btn"
					disabled={!tree}
					onClick={() => navigate("/tree")}
				>
					Open tree view
				</button>
			</div>
		</div>
	)
}