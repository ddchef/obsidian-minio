import { Editor, MarkdownFileInfo, MarkdownView, Notice, Plugin} from 'obsidian';
import { MinioClient } from 'src/client';
import { DEFAULT_SETTINGS, ObsidianMinioPluginSettings, ObsidianMinioSettingTab } from 'src/settings';
import { connectUrl, hashName, isValidSettings, splitName } from 'src/utils';

export default class ObsidianMinioPlugin extends Plugin {
	settings: ObsidianMinioPluginSettings;
	client: MinioClient;

	async onload() {
		await this.loadSettings();
		if(isValidSettings(this.settings)){
			this.client = new MinioClient(this.settings);
			this.setupHandlers();
		}
		this.addSettingTab(new ObsidianMinioSettingTab(this.app, this));
	}

	onunload() {
	}

	private setupHandlers(){
		this.registerEvent(this.app.workspace.on('editor-paste',this.pasteEventHandler.bind(this)))
	}

	private pasteEventHandler(e: ClipboardEvent, _: Editor, markdownView: MarkdownView | MarkdownFileInfo){
		if (!this.client) return this.credentialsError();
		if (!e.clipboardData) return;
		const files = e.clipboardData.files;
		e.preventDefault();
		this.uploadFiles(files);
	}

	private async uploadFiles(files: FileList){
		for (let index = 0; index < files.length; index++) {
			const file = files[index];
			if(/image\/.*/.test(file.type)){
				this.uploadFile(file);
			}
		}
	}

	private async uploadFile(file:File){
		const [name,fileType] = splitName(file.name);
		const filename = hashName(name);
		const pathName = `${filename}.${fileType}`;
		await this.client.put(file,pathName);
		const url = connectUrl(this.settings,pathName);
		this.writeLine(`![${file.name}](${url})`)
	}

	credentialsError() {
		new Notice("请填写 Minio 凭据以启用Obsidian Minio插件。");
		return true;
	}
	
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private writeLine(newLine: string) {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return new Notice('Error: No active view.');

		const { editor } = view;
		if (!editor) return new Notice(`Error: no active editor`);

		const cursor = editor.getCursor();
		const line = editor.getLine(cursor.line);
		editor.transaction({
			changes: [
				{
					from: { ...cursor, ch: 0, },
					to: { ...cursor, ch: line.length, },
					text: newLine + "\n",
				}
			]
		});
		cursor.line += 1;
		editor.setCursor(cursor);
	}
}