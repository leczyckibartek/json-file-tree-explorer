export type FileNode = {
	name: string;
	type: "file";
	size: number;
};

export type FolderNode = {
	name: string;
	type: "folder";
	children: TreeNodeData[];
};

export type TreeNodeData = FileNode | FolderNode;