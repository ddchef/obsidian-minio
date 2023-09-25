import ObsidianMinioPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

// Remember to rename these classes and interfaces!

export interface ObsidianMinioPluginSettings {
	endPoint: string; // 服务地址
  port?: string; // 端口
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucket: string;
  customDomain?: string;// 自定义域名
  dir?:string;// 基础文件夹
}

export const DEFAULT_SETTINGS: ObsidianMinioPluginSettings = {
	endPoint: '',
  useSSL: true,
  accessKey: '',
  secretKey: '',
  bucket: '',
	customDomain: ''
}


export class ObsidianMinioSettingTab extends PluginSettingTab {
	plugin: ObsidianMinioPlugin;

	constructor(app: App, plugin: ObsidianMinioPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('endPoint')
			.setDesc('必填项，服务器地址，不包含 http/https 协议的，可以是域名或者ip')
			.addText(text => text
				.setPlaceholder('请输入服务器地址')
				.setValue(this.plugin.settings.endPoint)
				.onChange(async (value) => {
					this.plugin.settings.endPoint = value;
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('port')
			.setDesc('端口,如果为空，当useSSL为true时，端口为 443，否则为 80')
			.addText(text => text
				.setPlaceholder('默认值为 443')
				.setValue(this.plugin.settings.port||'')
				.onChange(async (value)=>{
					this.plugin.settings.port = value;
					await this.plugin.saveSettings();
				})
			);
		new Setting(containerEl)
			.setName('useSSL')
			.setDesc('是否启用 https')
			.addToggle(toggle=>toggle
				.setValue(this.plugin.settings.useSSL)
				.onChange(async (value)=>{
					this.plugin.settings.useSSL = value;
					await this.plugin.saveSettings();
				}));
		
		new Setting(containerEl)
		.setName('accessKey')
		.setDesc('必填项')
		.addText(text => text
			.setPlaceholder('请输入accessKey')
			.setValue(this.plugin.settings.accessKey)
			.onChange(async (value)=>{
				this.plugin.settings.accessKey = value;
				await this.plugin.saveSettings();
			})
		);

		new Setting(containerEl)
		.setName('secretKey')
		.setDesc('必填项')
		.addText(text => text
			.setPlaceholder('请输入secretKey')
			.setValue(this.plugin.settings.secretKey)
			.onChange(async (value)=>{
				this.plugin.settings.secretKey = value;
				await this.plugin.saveSettings();
			})
		);

		new Setting(containerEl)
		.setName('bucket')
		.setDesc('必填项')
		.addText(text => text
			.setPlaceholder('请输入bucket')
			.setValue(this.plugin.settings.bucket)
			.onChange(async (value)=>{
				this.plugin.settings.bucket = value;
				await this.plugin.saveSettings();
			})
		);

		new Setting(containerEl)
		.setName('customDomain')
		.setDesc('自定义域名')
		.addText(text => text
			.setPlaceholder('请输入自定义域名')
			.setValue(this.plugin.settings.customDomain||'')
			.onChange(async (value)=>{
				this.plugin.settings.customDomain = value;
				await this.plugin.saveSettings();
			})
		);

		new Setting(containerEl)
		.setName('dir')
		.setDesc('文件存放根目录')
		.addText(text => text
			.setPlaceholder('请输入文件存放根目录')
			.setValue(this.plugin.settings.dir||'')
			.onChange(async (value)=>{
				this.plugin.settings.dir = value;
				await this.plugin.saveSettings();
			})
		);
	}
}
