import JsonInput from "../components/JsonInput"

export function HomePage() {

	return (
		<section>
			<header>
				<h1>Directory structure (JSON)</h1>
				<p>
					Paste JSON that describes a folder and file tree, or upload a{" "}
					<code>.json</code> file. The root must be a folder with{" "}
					<code>name</code>, <code>type: &quot;folder&quot;</code>, and{" "}
					<code>children</code>. Input is saved in this browser (
					<code>localStorage</code>) so it stays after refresh.
				</p>
			</header>
			<JsonInput />
		</section>
	)
}
