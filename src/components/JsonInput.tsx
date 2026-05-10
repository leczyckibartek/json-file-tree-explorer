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
			<label>JSON input</label>
			<textarea
				spellCheck={false}
				value={jsonText}
				onChange={(event) => setJsonText(event.target.value)}
				rows={16}
				className="w-full border-2 border-gray-300 rounded-md p-2"
			/>

			{(error ?? parseError) && (
				<div role="alert" className="text-red-500">{error ?? parseError}</div>
			)}

			<div>
				<JsonFileUpload
					onLoaded={(text) => {
						setError(null)
						setJsonText(text)
					}}
					onReadError={setError}
				/>
				<button
					type="button"
					disabled={!tree}
					onClick={() => navigate("/tree")}
				>
					Open tree view
				</button>
			</div>
		</div>
	)
}