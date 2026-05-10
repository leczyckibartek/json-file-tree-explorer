import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import JsonFileUpload from '@/components/JsonFileUpload'
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

	const parsed = jsonText.trim() ? parseDirectoryTreeJsonText(jsonText) : null
	const tree: FolderNode | null =
		parsed !== null && typeof parsed !== 'string' ? parsed : null
	const parseError = typeof parsed === 'string' ? parsed : null

	return (
		<div>
			<label htmlFor="json-input" className="vscode-kv-label vscode-label-block">JSON input</label>
			<textarea
				id="json-input"
				spellCheck={false}
				value={jsonText}
				onChange={(event) => setJsonText(event.target.value)}
				rows={18}
				className="vscode-editor-textarea"
			/>

			{(error ?? parseError) && (
				<div role="alert" className="vscode-alert">{error ?? parseError}</div>
			)}

			<div className="vscode-editor-toolbar">
				<JsonFileUpload
					onLoaded={(text) => {
						setError(null)
						setJsonText(text)
					}}
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