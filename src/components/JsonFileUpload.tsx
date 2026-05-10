import { useRef, type ChangeEvent } from "react"

type JsonFileUploadProps = {
	onLoaded: (text: string) => void
	onReadError: (message: string) => void
}

export default function JsonFileUpload({ onLoaded, onReadError }: JsonFileUploadProps) {
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		event.target.value = ""
		if (!file) return

		try {
			onLoaded(await file.text())
		}
		catch {
			onReadError("Could not read the file as text.")
		}
	}

	return (
		<>
			<input
				ref={fileInputRef}
				type="file"
				accept="application/json,.json"
				hidden
				onChange={handleFileChange}
			/>
			<button
				type="button"
				className="vscode-btn vscode-btn-secondary"
				onClick={() => fileInputRef.current?.click()}
			>
				Upload JSON file
			</button>
		</>
	)
}
