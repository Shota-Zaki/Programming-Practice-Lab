# Windows既存隔離機能の読み取り専用調査

2026-10-03 16:04–16:07 UTC、親指示により接続Windows PCだけをbounded read-onlyで調査した。IndexedDB修正checkpoint ee6bd42は先にwork反映・GitHub SHA/tree読戻しを完了した。これはnative受入試験やhost実装ではない。旧Macの不足観測はWindowsの機能不在を意味しない。

実測JSON: `evidence/2026-10-03-windows-isolation/`。OSはWindows 11 Home/build26200。現在の調査identityはtask checkout所有者と一致した（名前/SIDは記録しない）。秘密・distribution内容・ユーザーprofile・credential・既存container/VM内容は読んでいない。

|対象|実測|利用判断の限界|
|---|---|---|
|WSL/VirtualMachinePlatform|Win32_OptionalFeatureの両InstallState=1、有効。wsl.exeあり。WslService/HNSは既にRunning、vmcomputeはStopped|所有者HKCUのLxss登録metadataは0件。wsl.exe自体を実行していない。既承認の専用Linux環境、network namespace/cgroup/mount等の設定は確認できない|
|Hyper-V/Windows containers/Sandbox|対象featureはWMIのexact queryで未報告、vmms/Get-VMHost/Get-VMなし。WindowsSandbox.exeはPATH/固定system32で未確認|未報告をDisabled/Absentへ読み替えない。Windows HomeはWindows Sandboxのサポート対象外（下記公式資料）。有効化・edition変更・VM起動は実施していない|
|Docker/Podman|PATHと指定標準設置先の実行fileなし。com.docker.serviceなし。既知docker_engine/dockerDesktopLinuxEngine local pipeなし|他の設置先・remote engineの不在まで証明しない。daemon/context/credentialを読んでいない。既存の利用可能・既承認engineをこのscopeで確認できない|
|Job Objects|kernel32のCreate/Assign/Set/Query/Terminate/IsProcessInJob等のexportを解決できた|CPU hard cap、job/process committed-memory制限、関連process群停止のOS primitiveはある。jobを作成/設定/割当/停止していない。実browser全processへの適用、breakaway防止、停止後active-process=0は未検証|
|AppContainer|userenvのCreateAppContainerProfile/DeriveSIDのexportを解決できた|OSのnetwork/file/credential/process分離primitiveはある。profile/token/ACL/capabilityは作成・変更・他appから流用していない。PPL専用構成の存在・browser互換性・権限拒否は未確認|
|WFP|fwpuclntのFwpmEngineOpen0/FwpmFilterAdd0のexportを解決できた|filter engineへ接続せず、filter/firewallの読取・追加・変更はしていない。API存在は既承認policyや適用権限の証明ではない|

HypervisorPresent=trueだが、processor virtualization/SLAT/VM-monitorのCIM booleanはfalseだった。この組合せだけで物理CPU非対応やhypervisor不在と断定しない。VMを起動する探査も行っていない。

必要な制御と不足を以下に固定する。

|第7章contract|既存primitive/候補|今回確認できない設定・実装・受入|
|---|---|---|
|egress/DNS/WebRTC/外部navigationと他loopback portの拒否、固定bundleだけ許可|AppContainer/network policy（必要ならWFP）、または別途承認された隔離VM/container|専用配信originだけ通す具体的なOS policy、network capability/loopback例外のscope、全protocolの実負検証。WSL通常networkはホスト到達可能であり、WSL有効だけでは拒否にならない|
|bundle read-only/profileだけwrite、HOME/repo/credentials/socket非公開|AppContainerの明示resource grant、または分離guestのmount/ACL|専用profile/token、browser/runtimeへの最小resource grant、host data拒否、symlink/任意path拒否の実検証|
|browser/server以外のsubprocess制限|AppContainer token + Job/launcher側制御等を設計する必要|任意子processの起動制限とbrowser必要子processの両立。Job所属/数量制限だけでbinary allowlistを実装したとは扱わない|
|CPU-memory上限/全process停止/次run拒否|Job CPU hard cap、process/job committed-memory上限、breakawayなし、kill-on-close/Terminate + accounting|上限値、suspended起動からのjob所属、nested job/browser sandboxとの互換性、2秒起動応答・heartbeat・終了確認。どのAPIも今回は設定/実行していない|
|同origin/profile再open、実DOM/Storageとbundle/hash/run相関|trusted native host/controller/講座へのtransport|repoの通常UIではnativeボタンがdisabled。既存限定Worker/opaque DOM橋はこのhostではない。新しいtrusted native host/transportは存在しない（scope内src/scriptsの読取確認）|

既存WindowsにOS primitiveはあるが、必要制御を全て満たす既承認・設定済みPPL実行hostはこの調査では確認できなかった。既存executorのsandboxをlearner用hostとして流用可能とは推定しない。普通のbrowser profile、Playwright route/offline、CSPだけでnative gateを通さない。

追加承認が必要となる具体的操作は、方式が決まった後の専用AppContainer profile/ACL/capabilityの作成・変更、OS network/WFP/firewall policy設定、専用VM/container/distroの構築・起動やservice起動、runtimeのinstall/edition変更である。今はどれも未実施・未承認。Job primitiveの存在だけを理由に残境界の設定承認を拡張しない。必須installをDocker等に決めつけず、親へ現状と不足を返す。案A/native localStorage/同code exportの承認は維持する。

Readyな別実装単位は第7章workspace/project01保存のIndexedDB移行契約と実consumer接続。native host/transportはBlocked、course22/24=92%維持。fixture/preflightだけを追加してこのblockerを埋めたことにしない。

調査方法はGet-Command、選択Win32_* CIM property、選択Get-Service status、3固定実行fileパス、所有者HKCU LxssのVersion/Stateだけ、2既知pipeの存在、System32 DLLのNativeLibrary export解決。API関数は呼び出していない。VM/container/service/learner起動、install、OS/security変更、Mac access、第三者連絡、GitHub Actions利用なし。

公式根拠（2026-10-03確認、実測と区別）:

- [Windows Sandbox対応edition](https://learn.microsoft.com/en-us/windows/security/application-security/application-isolation/windows-sandbox/): Home非対応、閉じるとstate廃棄。
- [Job Objects](https://learn.microsoft.com/en-us/windows/win32/procthread/job-objects): 関連process群、breakaway、kill-on-close、securityは各process別。
- [CPU hard cap](https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-jobobject_cpu_rate_control_information)と[committed-memory limits](https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-jobobject_extended_limit_information): 対応する制限の意味。
- [AppContainer isolation](https://learn.microsoft.com/en-us/windows/win32/secauthz/appcontainer-isolation)と[legacy appへの構成](https://learn.microsoft.com/en-us/windows/win32/secauthz/appcontainer-for-legacy-applications-): resource grant/profile/token/ACLが必要。
- [WSL networking](https://learn.microsoft.com/en-us/windows/wsl/networking): NAT/mirroredからhostへ到達する通常経路。
- [Win32_OptionalFeature](https://learn.microsoft.com/en-us/windows/win32/cimwin32prov/win32-optionalfeature): InstallState1=Enabled。未報告を状態値へ読み替えない。
