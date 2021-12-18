
git clone https://github.com/Archieeeeee/tauridemo211218.git

#open a new terminal
cd tauridemo211218
yarn 
yarn run dev
#this will serve  at  http://localhost:3000/ which is used for tauri devPath

# open a new terminal
cd tauridemo211218/server
yarn 
yarn run dev
#this will serve  at  http://localhost:3002/  , the tauri will redirect the window location to this url after starting


# open a new terminal and test: 'dev' works but 'build' not
# test dev
yarn tauri dev
# test build
yarn tauri build --debug
# goto src-tauri/target/debug/ and run tauridemo-desktop.exe



