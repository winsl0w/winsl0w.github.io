Array.prototype.getUnique = function(){
    var u = {}, a = [];
    for (var i = 0, l = this.length; i < l; ++i) {
        if (u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
return a;
}

const getAssayNames = function(fields){
    var re = /([A-Z](-*)[A-z]+\s)+/g;
    return fields.map(d => { return d.match(re)[0].trim() });
}

const in_selection = function(selection,col,row){
    const in_row = selection.some(v => v === row)
    const in_col = selection.some(v => v === col)
    return in_row && in_col;
}

const format_loadings_labels = function(labels){
    for(let i=0; i<labels.length; i++){
        for(let j=0; j<labels[i].length; j++){
            labels[i][j] = labels[i][j].replace('_',' ')
        }
    }
    return labels;
}

const get_apriori_grp = function(metric_name,apriori){

    for(let i=0; i<apriori.length; i++){
        if(apriori[i].fields.some( j => { return j === metric_name })){
            return apriori[i].name;
        }
    }
}

const get_matrix_type = function(){
    if(Math.floor(d3.select('#matrix-header').select('select').nodes()[0].value / 2)){
        return 'distilled';
    } else {
        return 'full';
    }
}

const get_dataset_idx = function(){
    return parseInt(d3.select('#matrix-header').select('select').nodes()[0].value,10) % 2;
}

// update the apriori menu selection and selected metric
const update_apriori_menu = function(metric_name){

    var qselect_div;
    var selection = {
        group: null,
        active: false,
    }
    d3.select('#tab-header').select('select')
        .each(function(d){
            selection.group = get_apriori_grp(metric_name,d);
            qselect_div = d3.select('#behavior-selection-div')
                .selectAll('div')
                    .filter(function(){ return this.innerHTML === selection.group });
            if(qselect_div.size()){
                if(qselect_div.attr('class') !== 'selected'){
                    qselect_div.nodes()[0].click();
                }
            }
        })

    var selected_div = d3.select('#metric-selections').selectAll('div')
        .style('border','1px solid transparent')
        .filter(function(d,i){
            return this.innerHTML === metric_name
        })
        .style('border','1px dashed rgb(150,150,150)')

    if(selected_div.size()){
        selection.active = selected_div.attr('class') === 'active';
    }
    return selection;
}


// schedule all page updates for metric selection change
const update_selected_metric = function(metric_name){

    // update metric summary dropdown

    // update qselection and metric selection menus
    const selection = update_apriori_menu(metric_name);

    // update loading dropdown menu
    if(selection.active){
        var loadings_dropdown = d3.select('#tab-header').select('select').nodes()[0];

        if(loadings_dropdown.value !== selection.group){
            loadings_dropdown.value = selection.group;
            var event = new Event('change', {value: selection.group});
            loadings_dropdown.dispatchEvent(event);
        }
    }
}
