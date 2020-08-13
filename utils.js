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

// update the apriori menu selection and selected metric
const update_apriori_menu = function(metric_name){

    var qselect_div;
    var div_pos;
    var ndiv = qselect_div = d3.select('#metric-selections').selectAll('div').size();
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
            if(qselect_div.attr('class') !== 'selected'){
                qselect_div.nodes()[0].click();
            }
        })

    var selected_div = d3.select('#metric-selections').selectAll('div')
        .style('border','1px solid transparent')
        .filter(function(d,i){
            if(this.innerHTML === metric_name){
                div_pos = i;
            }
            return this.innerHTML === metric_name
        })
        .style('border','1px dashed rgb(150,150,150)')


    var mselections_div = d3.select('#metric-selections').nodes()[0]
    var max_scroll = mselections_div.scrollHeight - mselections_div.offsetHeight;
    //d3.select('#metric-selections').nodes()[0].scrollTop = max_scroll * div_pos / (ndiv-1);

    selection.active = selected_div.attr('class') === 'active';
    return selection;
}


// schedule all page updates for metric selection change
const update_selected_metric = function(metric_name){

    // update metric summary dropdown

    // update qselection and metric selection menus
    const selection = update_apriori_menu(metric_name);

    console.log(selection)

    // update loading dropdown menu
    if(selection.active){
        var loadings_dropdown = d3.select('#tab-header').select('select').nodes()[0];
        loadings_dropdown.value = selection.group;
        loadings_dropdown

        var event = new Event('change', {value: selection.group});
        loadings_dropdown.dispatchEvent(event);
    }
    
    // update scatter plot
}
