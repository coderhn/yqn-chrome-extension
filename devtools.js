// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

chrome.devtools.panels.create("yqn", "icon.png", "panel.html", () => {
  console.log("user switched to this panel");
});

function handleRequestFinished(request) {
  if (
    request._resourceType === "xhr" &&
    request.response.status === 200 &&
    request.response.content.mimeType === "application/json"
  ) {
    console.log('request',request);
    // 解码压缩数据
    // const decoder = new TextDecoder();
    // const decompressedData = decoder.decode(new Uint8Array(request.response.content));

    // // 将解压后的数据解析为JSON对象
    // const json = JSON.parse(decompressedData);
    // console.log("json",json)
  }
  // request.getContent().then(([content, mimeType]) => {
  //   console.log("Content: ", content);
  //   console.log("MIME type: ", mimeType);
  // });
}

chrome.devtools.network.onRequestFinished.addListener(handleRequestFinished);
