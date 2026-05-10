import JsonInput from '@/components/JsonInput'

export function HomePage() {

	return (
		<div className="vscode-editor-part">
			<div className="vscode-tabs" role="tablist">
				<div className="vscode-tab is-active" role="tab" aria-selected="true">
					input.json
				</div>
			</div>
			<div className="vscode-editor-body">
				<header className="vscode-section-spacing">
					<p>
						Paste JSON that describes a folder and file tree, or upload a{" "}
						<code>.json</code> file. The root must be a folder with{" "}
						<code>name</code>, <code>type: &quot;folder&quot;</code>, and{" "}
						<code>children</code>. Input is saved in this browser (
						<code>localStorage</code>) so it stays after refresh.
					</p>
				</header>
				<JsonInput />
			</div>
		</div>
	)
}
