define([
    'jquery',
], function ($) {

  var RemoteModel = function(model) {
    // private
    var PAGESIZE = 50;
    this.model = model;
    this.searchstr = "";
    this.sortcol = null;
    this.sortdir = 1;
    this.h_request = null;
    this.req = null; // ajax request

    this.data_view = new Slick.Data.DataView({
      inlineFilters: false,
      enableTextSelectionOnCells: true
    })

    // events
    this.onDataLoading = new Slick.Event();
    this.onDataLoaded = new Slick.Event();
  }

  RemoteModel.prototype.init = function() {

  }

  RemoteModel.prototype.isDataLoaded = function(from, to) {
    for (var i = from; i <= to; i++) {
      if (this.data[i] == undefined || this.data[i] == null) {
        return false;
      }
    }

    return true;
  }


  RemoteModel.prototype.clear = function() {
    for (var key in data) {
      delete this.data[key];
    }
    this.data.length = 0;
  }

  RemoteModel.prototype.ensureData = function(from, to) {

    this.onDataLoading.notify({from: from, to: to});

    this.model.set('range_start', from)
    this.model.set('range_end', to)

    this.data_frame = JSON.parse(this.model.get('_df_json'));

    var self = this,
        row_data = [],
        row_count = 0;

    _.each(this.data_frame, function (cur_row, key, list) {
      cur_row.id = "row" + row_count;
      row_count++;
      row_data.push(cur_row);
    }, this);

    this.data_view.beginUpdate();
    this.data_view.setItems(row_data);
    this.data_view.endUpdate();

    this.onDataLoaded.notify({from: from, to: to});

//    if (this.req) {
//      this.req.abort();
//      for (var i = this.req.fromPage; i <= this.req.toPage; i++)
//        this.data[i * PAGESIZE] = undefined;
//    }
//
//    if (from < 0) {
//      from = 0;
//    }
//
//    if (data.length > 0) {
//      to = Math.min(to, data.length - 1);
//    }
//
//    var fromPage = Math.floor(from / PAGESIZE);
//    var toPage = Math.floor(to / PAGESIZE);
//
//    while (this.data[fromPage * PAGESIZE] !== undefined && fromPage < toPage)
//      fromPage++;
//
//    while (this.data[toPage * PAGESIZE] !== undefined && fromPage < toPage)
//      toPage--;
//
//    if (fromPage > toPage || ((fromPage == toPage) && data[fromPage * PAGESIZE] !== undefined)) {
//      // TODO:  look-ahead
//      this.onDataLoaded.notify({from: from, to: to});
//      return;
//    }
//
//    var url = "http://api.thriftdb.com/api.hnsearch.com/items/_search?filter[fields][type][]=submission&q=" + searchstr + "&start=" + (fromPage * PAGESIZE) + "&limit=" + (((toPage - fromPage) * PAGESIZE) + PAGESIZE);
//
//    if (sortcol != null) {
//        url += ("&sortby=" + sortcol + ((sortdir > 0) ? "+asc" : "+desc"));
//    }
//
//    if (h_request != null) {
//      clearTimeout(h_request);
//    }
//
//    h_request = setTimeout(function () {
//      for (var i = fromPage; i <= toPage; i++)
//        this.data[i * PAGESIZE] = null; // null indicates a 'requested but not available yet'
//
//      this.onDataLoading.notify({from: from, to: to});
//
//      this.req = $.jsonp({
//        url: url,
//        callbackParameter: "callback",
//        cache: true,
//        success: onSuccess,
//        error: function () {
//          onError(fromPage, toPage)
//        }
//      });
//      this.req.fromPage = fromPage;
//      this.req.toPage = toPage;
//    }, 50);
  }

  RemoteModel.prototype.onError = function(fromPage, toPage) {
    alert("error loading pages " + fromPage + " to " + toPage);
  }

  RemoteModel.prototype.onSuccess = function(resp) {
    var from = resp.request.start, to = from + resp.results.length;
    this.data.length = Math.min(parseInt(resp.hits),1000); // limitation of the API

    for (var i = 0; i < resp.results.length; i++) {
      var item = resp.results[i].item;

      // Old IE versions can't parse ISO dates, so change to universally-supported format.
      item.create_ts = item.create_ts.replace(/^(\d+)-(\d+)-(\d+)T(\d+:\d+:\d+)Z$/, "$2/$3/$1 $4 UTC");
      item.create_ts = new Date(item.create_ts);

      this.data[from + i] = item;
      this.data[from + i].index = from + i;
    }

    this.req = null;

    this.onDataLoaded.notify({from: from, to: to});
  }


  RemoteModel.prototype.reloadData = function(from, to) {
    for (var i = from; i <= to; i++){
      delete this.data[i];
    }

    this.ensureData(from, to);
  }


  RemoteModel.prototype.setSort = function(column, dir) {
    this.sortcol = column;
    this.sortdir = dir;
    this.clear();
  }

  RemoteModel.prototype.setSearch = function(str) {
    this.searchstr = str;
    this.clear();
  }

  return {'RemoteModel': RemoteModel}
});
