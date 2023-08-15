chrome.runtime.sendMessage({ 
    message: "get_cur_tab"
}, response => {
    if (response.message === 'success') {
        console.log(`Hello ${response.payload}`);
    }
});

