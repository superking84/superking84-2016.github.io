window.onload = function(){
    let linkRows = document.getElementsByTagName('tr')
    for (let i = 0; i < linkRows.length; i++){
        let row = linkRows[i]
        if (row.dataset.href !== undefined){
            row.onclick = function(){
                window.location.href = row.dataset.href
            }
        }
    }
}