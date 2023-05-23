# world_x
![Videotogif](https://github.com/Chabuei/Gravity-Point-Calculator/assets/102859047/1ab9ac97-fbca-4bba-939f-939ec991a7a7)

# URL
https://twitter.com/EishinIshida/status/1657430851825836033(映像バージョン)

# Overview
Three.jsとWebAssemblyを用いたアバター制御と自作当たり判定システム(※スマートフォンには対応していません)

#　Requirement
ZIPファイルを解凍後、プロジェクトのメインディレクトリ(package.jsonが入っているフォルダ)に移動してnpm installを実行後、npm run devで実行できます。<br>

Windows 11<br>
npm 8.3.1<br>

# Usage
W key: 前進<br>
W key + Space key: ダッシュ<br>
A key or D key: 回転<br>

#Detail
現在自分が作成・担当しているWebメタバース(個人製作)のアバター制御機能と当たり判定システムをフルスクラッチで開発。Three.jsと軽量化のためにRapier.jsというWebAssemblyライブラリを使用。当たり判定には従来物理エンジンライブラリが必要とされるが、スケーラビリティ向上と軽量化のためにそれらをスクラッチ開発した。結果として従来の物理ンエンジンを使用した場合よりもCPU負荷を最低でも15%程減らすことに成功した。



