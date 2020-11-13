var linear_filter = true;
$(document).on('change','.select_liner_data',function(){
     var selected_val = $(this).find('option:selected').attr("name");
     console.log("*** Linear Data ***");
     count = 0;
     $('select.select_liner_data>option').each(function () {
        count = count + 1
     });
     console.log("Count : ")
     console.log(count)
     if(linear_filter == true)
     {
         linear_filter = false;
         $('select.select_liner_data>option').each(function () {
             var filter_val = $(this).attr("name");
             console.log(filter_val)
             if(filter_val == selected_val)
             {
                 $(this).prop('selected',true);
             }
             else
             {
                 console.log(filter_val);
                 if(filter_val != 0)
                 {
                     $(this).detach();
                     console.log("**************")
                     console.log($(this).val());
                 }
             }
         });
         $('select.select_liner_data').each(function () {
              $(this).append('<option value="0">Refresh Data</option>')
         })
     }
     else
     {
         linear_filter = true;
         var ref_ids = $(".ref_select_drop").map(function(){return $(this).attr('id');}).get();
         console.log("Ref IDS : "+ref_ids)
         $(".select_liner_data").empty();
         for(i=0; i < ref_ids.length; i++)
         {

             $.ajax({
               url: '/referanfce_col_filter',
               type: 'POST',
               async:false,
               data: {csrfmiddlewaretoken: window.CSRF_TOKEN, col_id:ref_ids[i]},
               success: function (data)
               {
                 console.log("Data form referanfce_col_filter : ");
                 console.log(data.filter_value);
                 $("."+ref_ids[i]).append('<option value="'+0+'">Select..</option>')
                 for(x=0 ; x<data.filter_value.length; x++)
                 {
                   $("."+ref_ids[i]).append('<option value="'+data.filter_value[x].c_v+'" name="'+ data.filter_value[x].row_num +'">'+data.filter_value[x].c_v+'</option>')
                 }
               }
             });
         }
     }

 });


/* ADDING NEW ROW VIA MODEL */
 $(".adddetails").click(function(event){

     event.preventDefault();
     validation_checker = false;
     var values = $(".detailid_add_new").map(function(){
                                                         if(($(this).val() == "" || $(this).val() == "Select..") && ($(this).attr('name') == "NOTNULL"))
                                                         {
                                                             $(this).css({'border':'1px solid #d1383d'});
                                                             validation_checker = true;
                                                         }
                                                         else
                                                         {
                                                             $(this).css({'border':'1px solid green'});
                                                         }
                                                         return $(this).val();
                                                       }).get();

     $(".detailid_add_new_image").map(function(){
                                                 if($(this).val() == "" && $(this).closest('form').attr('name') == "NOTNULL")
                                                 {
                                                     $(this).css({'border':'1px solid #d1383d'});
                                                     validation_checker = true;
                                                 }
                                                 else
                                                 {
                                                     $(this).css({'border':'1px solid green'});
                                                 }
                                                 }).get();

     if(validation_checker != true)
     {
         var relation = $(".detailid_add_new").map(function(){return $(this).attr('id');}).get();
         var mx = $(".table_body").attr('id')
         var table_id = $("thead").attr('id');
         var imp = 0;
         console.log('Row Maximum id : '+mx);
         console.log('Table id : ' + table_id);
         console.log("Values : "+values);
         console.log("Relation : "+relation)

         /** UPDATING NORMAL COLUMNS VALUES **/
         for(i =0; i<values.length; i++)
         {
           if (i == values.length - 1)
           {
                 imp = 1;
           }
           console.log("IMP : " + imp);
           $.ajax({
             type:"POST",
             url: "/adddetails",
             async:false,
             data:{csrfmiddlewaretoken: window.CSRF_TOKEN, d1: values[i], rr:relation[i], mx:mx , table_id:table_id, imp:imp},
             success: function( data ){
               console.log(data.Result);
               $(".detailid").map(function(){return $(this).val('');})
             }
           });
         }
         /** UPDATING NORMAL COLUMNS VALUES END **/

         /** Image data upload **/
         console.log("--- Uploading Images ---")
         var image_columns_id = $(".detailid_add_new_image").map(function(){return $(this).attr('id');}).get();
         var form_data_image = $(".fileUploadForm_images_data").map(function(){return $(this)[0];}).get();
         console.log("image_columns_id : - ");
         console.log(image_columns_id);
         console.log("form_data_image : -");
         console.log(form_data_image);
         for(i=0; i<image_columns_id.length; i++)
         {
             var form = form_data_image[i];
             var data = new FormData(form);
             data.append("id",$("thead").attr('id'));
             data.append('max_row', $(".table_body").attr('id'));
             data.append('image_columns_id', image_columns_id[i])
             $.ajax({
                 type:"POST",
                 enctype: 'multipart/form-data',
                 url: "/data_image_upload",
                 async:false,
                 data:data,
                 processData: false,
                 contentType: false,
                 cache: false,
                 timeout: 600000,
                 success: function( data ){
                   console.log(data);
                 }
             });
         }
         /** Image data upload end **/

         /** UPDATING  CALCULATION COLUMN VALUES **/
         console.log("======== Add Detaild Calc Value ========")
         var relation_clc = $(".detailid_clc").map(function(){return $(this).attr('id');}).get();
         console.log("calc IDS : "+relation_clc);
         for(i=0; i<relation_clc.length; i++)
         {
             $.ajax({
                 type:"POST",
                 url: "/cal_add_details",
                 async:false,
                 data:{csrfmiddlewaretoken: window.CSRF_TOKEN, mx:mx, base_id:event.target.id, relation_clc:relation_clc[i], d1: values, rr:relation},
                 success: function( data ){
                   console.log(data);
                 }
             });
         }
         /** UPDATING  CALCULATION COLUMN VALUES END **/


         setTimeout(function(){location.reload();}, 2000);

     }
     else
     {
         new Noty({
            type: 'error',
            layout: 'topRight',
            theme: 'metroui',
            text: 'Required fields cannot be empty. ! 🤖',
            timeout: '4000',
            progressBar: true,
            closeWith: ['click'],
            killer: true,

         }).show();
     }
 });
 /*ADDING NEW ROW END*/


 function openNav() {
   document.getElementById("mySidenav").style.width = "250px";
   document.getElementById("main").style.marginLeft = "250px";
 }

 function closeNav() {
   document.getElementById("mySidenav").style.width = "0";
   document.getElementById("main").style.marginLeft= "0";
 }

 /* ADDING NEW COLUMN */
 $("#savenewcol").click(function(){

     var colname = $(".newcol").val();
     var col_type = $(".newcoltype").val();
     var col_size = $(".newcolsize").val();
     var null_type = $(".nultype").val();
     var fk = 0;
     var mx = 0;
     if(check_sub_table_or_main == 1)
     {
         fk = sub_table_genaric_id;
         mx = $(".sub_tables_main").attr('id');
     }
     else
     {
         fk = $("thead").attr('id');
         mx = $(".table_body").attr('id');
     }


     console.log('Row Maximum id : '+mx);
     console.log('column name : '+colname);
     console.log('column type : '+col_type);
     console.log('column type : '+col_size);
     console.log('null type : '+null_type);
     console.log('FK is : '+ fk)
     if(col_size == '')
     {
         col_size = 40
     }
     $.ajax({
         type:"POST",
         url: "/Newcol",
         async: false,
         data:{csrfmiddlewaretoken: window.CSRF_TOKEN, fk: fk, colname:colname, mx:mx, col_type:col_type , col_size:col_size,nul_type:null_type},
         success: function( data )
         {
         console.log(data);
         }
     });
     if(check_sub_table_or_main == 1)
     {
         // alert('ooo');
         var table_id = sub_table_genaric_id;
         console.log("table_id : " + table_id)
         console.log("col_val_names_sub_table : " + col_val_names_sub_table)
         console.log("col_val_id_sub_table + " + col_val_id_sub_table)
         console.log("sub_table_genaric_id : " + sub_table_genaric_id);

         $(".addcol_additional").empty();
         $(".table_body_additional").empty();
         $(".new_row_btn_div").empty();

         $.ajax({
             type:"POST",
             url: "/Tables",
             data:{csrfmiddlewaretoken: window.CSRF_TOKEN, table_id:table_id, col_val_names_sub_table:col_val_names_sub_table, col_val_id_sub_table:col_val_id_sub_table},
             success: function( data )
             {
                 $(".sub_tables_main").attr('id', data.max_row);
                 var append_var = "<tr>";
                 console.log(data);
                 for(i=0; i<data.Cols.length; i++)
                 {
                     append_var = append_var + '<th id="' + data.Cols[i]["pk"] + '">' + data.Cols[i]["c_name"] + '</th>';
                 }
                 append_var = append_var + "</tr>"
                 $(".addcol_additional").append(append_var);
                 $(".new_row_btn_div").append('<button class="btn btn-sm btn-danger new_row_add_sub_table">New Record</button>');
                 $(".new_row_btn_div").append('<button class="btn btn-sm btn-info sub_table_calcuation">Add Calc. column</button>');
                 $(".new_row_btn_div").append('<button class="btn btn-sm btn-primary sub_table_new_column" data-toggle="modal" data-target="#myModal1">Add new column</button>');
                 $(".new_row_btn_div").append('<button class="btn btn-sm btn-success sub_table_new_ref_column">Add Ref. column</button>');
                 $(".new_row_btn_div").append('<button class="btn btn-sm btn-success sub_table_import"  data-toggle="modal" data-target="#importmod">Import</button>');

                 var append_body = "";
                 console.log("=====================");
                 console.log(data.Cols.length);
                 for(i=0; i<data.Details.length; i++)
                 {
                     console.log("=====================");
                     if((i>0) && (i % data.Cols.length == 0))
                     {
                         append_body = append_body +  '<td><button class="btn btn-sm btn-danger sub_table_row_delete" id="' + data.Details[i][2] + '">Delete</button></td>';
                         append_body = append_body +  '<td><button class="btn btn-sm btn-danger sub_table_row_edite" id="' + data.Details[i][2] + '">Edit</button></td>';

                         append_body = append_body + '</tr>';

                         append_body = append_body + '<tr>';
                     }
                     else if(i == 0)
                     {
                         append_body = append_body + '<tr>';
                     }

                    append_body = append_body + '<td id="' + data.Details[i][1] + '" class="sub_td">' + data.Details[i][0] + '</td>';

                 }
                 l = data.Cols.length - 1
                 append_body = append_body + '<td><button class="btn btn-sm btn-danger sub_table_row_delete" id="' + data.Details[l][2] + '">Delete</button></td>';
                 append_body = append_body + '<td><button class="btn btn-sm btn-danger sub_table_row_edite" id="' + data.Details[l][2] + '">Edit</button></td></tr>';

                 $(".table_body_additional").append(append_body);
                 console.log(append_body)

             }
         });
     }
     else
     {
         setTimeout(function(){location.reload();}, 2000);
     }

 });
 /* ADDING NEW COLUMN END*/

 /* ADD REF.COLUMN */

 $(document).ready(function(){

     /* Relation tables fetching */
     $("#col_relation").click(function(){
       $("#Relation_column_model").modal('show');
       key = $("thead").attr('id');
       console.log('Mater table id : '+ key)
       $.ajax({
           url: '/relation_maters',
           type: 'POST',
           data: {csrfmiddlewaretoken: window.CSRF_TOKEN, key:key},
           success: function (data)
           {
               console.log(data);
               console.log(data.Result.length);
               $("#master_table_relation_select").empty()
               $("#master_table_relation_select").append('<option value="0">Select...</option>');
               for(i=0; i<data.Result.length; i++)
               {
                 if(data.Result[i].pk != key){
                 console.log(data.Result[i]);
                 $("#master_table_relation_select").append('<option value="'+data.Result[i].pk+'">'+data.Result[i].base_name+'</option>')
               }
               }
           },
           error:function(e)
           {
               console.log(e)
           }
       });
     });
     /* Relation tables fetching  end*/


     /* Relation column of tables fetching */
     $("#master_table_relation_select").on('change', function() {

         console.log($("#master_table_relation_select option:selected").text());
         $.ajax({
             url: '/filter_columns_for_relation',
             type: 'POST',
             data: {csrfmiddlewaretoken: window.CSRF_TOKEN, fk:this.value},
             success: function (data)
             {
                 console.log(data);
                 $("#master_table_relation_column_select").empty()
                 $("#master_table_relation_column_select").append('<option value="0">Select...</option>');
                 for(i=0; i<data.Result.length; i++)
                 {
                     console.log(data.Result[i]);
                     $("#master_table_relation_column_select").append('<option value="'+data.Result[i].pk+'">'+data.Result[i].c_name+'</option>')
                 }
             },
             error:function(e){ console.log(e) }
         });

     });
     /* Relation column of tables fetching  end*/


     $("#btn_add_relation").click(function(){

         var key = $("#master_table_relation_column_select").val();
         var name = $("#master_table_relation_select option:selected").text();

         var mx = 0;
         var m_key = 0;

         if(check_sub_table_or_main == 1)
         {
             m_key = sub_table_genaric_id;
             mx = $(".sub_tables_main").attr('id');
         }
         else
         {
             m_key = $("thead").attr('id');
             mx = $(".table_body").attr('id')
         }

         console.log("key : "+ key);
         console.log("m_key : " + m_key);
         console.log("mx : " + mx);
         console.log("name : " + name);

         $.ajax({
             url: '/save_relation_column',
             type: 'POST',
             async: false,
             data: {csrfmiddlewaretoken: window.CSRF_TOKEN, key:key, m_key:m_key, name:name, mx:mx, base_id:$("thead").attr('id')},
             success: function (data)
             {
                 console.log(data);
             },
             error:function(e){ console.log(e) }
         });

        if(check_sub_table_or_main == 1)
         {
             var table_id = sub_table_genaric_id;
             console.log("table_id : " + table_id)
             console.log("col_val_names_sub_table : " + col_val_names_sub_table)
             console.log("col_val_id_sub_table + " + col_val_id_sub_table)
             console.log("sub_table_genaric_id : " + sub_table_genaric_id);

             $(".addcol_additional").empty();
             $(".table_body_additional").empty();
             $(".new_row_btn_div").empty();

             $.ajax({
                 type:"POST",
                 url: "/Tables",
                 data:{csrfmiddlewaretoken: window.CSRF_TOKEN, table_id:table_id, col_val_names_sub_table:col_val_names_sub_table, col_val_id_sub_table:col_val_id_sub_table},
                 success: function( data )
                 {
                     $(".sub_tables_main").attr('id', data.max_row);
                     var append_var = "<tr>";
                     console.log(data);
                     for(i=0; i<data.Cols.length; i++)
                     {
                         append_var = append_var + '<th id="' + data.Cols[i]["pk"] + '">' + data.Cols[i]["c_name"] + '</th>';
                     }
                     append_var = append_var + "</tr>"
                     $(".addcol_additional").append(append_var);
                     $(".new_row_btn_div").append('<button class="btn btn-sm btn-danger new_row_add_sub_table">New Record</button>');
                     $(".new_row_btn_div").append('<button class="btn btn-sm btn-info sub_table_calcuation">Add Calc. column</button>');
                     $(".new_row_btn_div").append('<button class="btn btn-sm btn-primary sub_table_new_column" data-toggle="modal" data-target="#myModal1">Add new column</button>');
                     $(".new_row_btn_div").append('<button class="btn btn-sm btn-success sub_table_new_ref_column">Add Ref. column</button>');
                     $(".new_row_btn_div").append('<button class="btn btn-sm btn-success sub_table_import"  data-toggle="modal" data-target="#importmod">Import</button>');

                     var append_body = "";
                     console.log("=====================");
                     console.log(data.Cols.length);
                     for(i=0; i<data.Details.length; i++)
                     {
                         console.log("=====================");
                         if((i>0) && (i % data.Cols.length == 0))
                         {
                             append_body = append_body +  '<td><button class="btn btn-sm btn-danger sub_table_row_delete" id="' + data.Details[i][2] + '">Delete</button></td>';
                             append_body = append_body +  '<td><button class="btn btn-sm btn-danger sub_table_row_edite" id="' + data.Details[i][2] + '">Edit</button></td>';

                             append_body = append_body + '</tr>';

                             append_body = append_body + '<tr>';
                         }
                         else if(i == 0)
                         {
                             append_body = append_body + '<tr>';
                         }

                        append_body = append_body + '<td id="' + data.Details[i][1] + '" class="sub_td">' + data.Details[i][0] + '</td>';

                     }
                     l = data.Cols.length - 1
                     append_body = append_body + '<td><button class="btn btn-sm btn-danger sub_table_row_delete" id="' + data.Details[l][2] + '">Delete</button></td>';
                     append_body = append_body + '<td><button class="btn btn-sm btn-danger sub_table_row_edite" id="' + data.Details[l][2] + '">Edit</button></td></tr>';

                     $(".table_body_additional").append(append_body);
                     console.log(append_body)

                 }
             });
         }
         else
         {
             setTimeout(function(){location.reload();}, 2000);
         }
     });
 });

 /* ADD REF.COLUMN END */


 /* INLINE EDIT */
 $(document).ready(function() {

     ENT = 0;
     var inline_count = 0;
     var old_txt = "";
     var key = "";
     var txt;

     /* INLINE EDITING ENABLED */

     $("td").mouseenter(function() {

     var lights = document.getElementsByClassName("inline_td");

     while (lights.length)
     {
         console.log(lights[0].classList);
         lights[0].classList.remove("inline_td");
     }

     var lights = document.getElementsByClassName("inlinetxt");

     while (lights.length)
     {
         console.log(lights[0].classList);
         lights[0].classList.remove("inlinetxt");
     }

     if(ENT ==0)
     {

         if (inline_count == 0)
         {
             var inline_type  = '';
             inline_count = 1;
             console.log("ID : "+ $(this).attr('id'));
             var auth_key = $(this).attr('id');
             var inline_val = $(this).text().trim();
             var elm = $(this);
             console.log("ELM :- ");
             console.log(elm);
             old_txt = $(this).text();
             key = $(this).attr('id')
             $(elm).empty();
             $(elm).addClass("inline_td");

             // $('#alertmodal').modal('show');

             $.ajax({
                 url:'/inline_type',
                 type:'POST',
                 data:{csrfmiddlewaretoken: window.CSRF_TOKEN, key:auth_key, base_id:$("thead").attr('id')},
                 success:function(data)
                 {
                     console.log("=================");
                     console.log(data);
                     if(data.Rate == 0)
                     {
                         $(".inline_td").empty();
                         $(".inline_td").text(old_txt);
                         $(elm).removeClass("inline_td");
                         inline_count = 0;
                         ENT=0;
                     }
                     else
                     {
                         if (data.Result[0].d_type.trim() == 'Date')
                         {
                             inline_type = 'Date';
                         }
                         else if (data.Result[0].d_type.trim() == 'Time')
                         {
                             inline_type = 'Time';
                         }
                         else if(data.Result[0].d_type.trim() == 'Calc')
                         {
                               inline_type = 'Calc';
                         }
                         else if(data.Result[0].d_type.trim() == 'Text' ||  data.Result[0].d_type.trim() == 'String')
                         {
                             inline_type = 'text';
                         }
                         else if( data.Result[0].d_type.trim() == 'Numeric'|| data.Result[0].d_type.trim() == 'Number')
                         {
                             inline_type = 'Number';
                         }

                         else if(data.Result[0].d_type.trim() == 'Image')
                          {
                              inline_type = 'File';
                          }
                         else
                         {
                             inline_type = "select"
                         }

                         console.log("Inline Type : " + inline_type)
                         if(inline_type == 'select')
                         {
                             console.log("Inline type is Select")
                             $(elm).append('<select class="inlinetxt form-control rr select2">');
                             for(i=0; i<data.Relation.length;i++)
                             {
                                 $('.rr').append('<option value="'+data.Relation[i]+'">'+data.Relation[i]+'</option>')
                             }
                             $(elm).append('</select>');
                              $('.select2').select2();
                             console.log(data.Relation.length);
                             $(elm).append(' <button class="btn inlinebtn p-0" id="saveinline" style="margin-left:10px;"><i class="fa fa-check" aria-hidden="true"></i></button><button class="btn inlinebtn p-0" id="cancelinline"><i class="fa fa-times" aria-hidden="true"></i></button>');

                         }
                         else if(inline_type == 'Calc')
                         {
                             console.log("Inline type is Calc")
                             console.log('Val: '+inline_val)
                             console.log('Type: '+inline_type)
                             var div = "<div class='d-flex align-items-center'>"
                             $(elm).append(''+div+'<input type="text" class="inlinetxt form-control max" value="'+inline_val+'" maxlength="'+data.Result[0].d_size+'" ><button class="btn inlinebtn p-0" id="cancelinline"><i class="fa fa-times" aria-hidden="true"></i></button>');

                         }
                         else if(inline_type == 'File')
                         {
                             console.log("Inline type is File")
                             console.log('Val: '+inline_val)
                             console.log('Type: '+inline_type)
                             var div = "<div class='d-flex align-items-center'>";
                             $(elm).append(''+div+'<form method="POST" enctype="multipart/form-data" class="Inline_fileUploadForm_images_data"><input type="file" class="inlinetxt form-control max Inline_detailid_add_new_image" name="files"></form><button class="btn inlinebtn p-0" id="saveinline_image"><i class="fa fa-check" aria-hidden="true"></i></button><button class="btn inlinebtn p-0" id="cancelinline"><i class="fa fa-times" aria-hidden="true"></i></button>');
                          }
                         else
                         {
                             console.log("Inline type is Not Select")
                             console.log('Val: '+inline_val)
                             console.log('Type: '+inline_type)
                             var div = "<div class='d-flex align-items-center'>"
                             // $(elm).append('<input type="'+inline_type+'" class="inlinetxt form-control" value="'+inline_val+'" maxlength="'+data.Result[0].d_size+'">');

                             // $(elm).append('<button class="btn inlinebtn" id="saveinline"><span class="glyphicon glyphicon-ok"></span></button><button class="btn inlinebtn" id="cancelinline"><span class="glyphicon glyphicon-remove"></span></button>');
                             $(elm).append(''+div+'<input type="'+inline_type+'" class="inlinetxt form-control exL" value="'+inline_val+'" maxlength="'+data.Result[0].d_size+'"><button class="btn inlinebtn p-0" id="saveinline"><i class="fa fa-check" aria-hidden="true"></i></button><button class="btn inlinebtn p-0" id="cancelinline"><i class="fa fa-times" aria-hidden="true"></i></button>');

                         }

                     }
                 }

             });

         }

         /*INLINE EDITING  CANCEL BUTTON*/
         $(document).on("click", "#cancelinline", function(){
             $(".inline_td").empty();
             $(".inline_td").text(old_txt);
             $(elm).removeClass("inline_td");
             inline_count = 0;
             ENT=0;
         });
         /*INLINE EDITING  CANCEL BUTTON END*/

         /*INLINE IMAGE EDITING SAVE*/
         $(document).on("click", "#saveinline_image", function(){
             console.log("--- Uploading Images ---")
             var form = $('.Inline_fileUploadForm_images_data')[0];
             var data = new FormData(form);
             data.append("id", key);
             data.append('base_id', $("thead").attr('id'));
             data.append("csrfmiddlewaretoken", window.CSRF_TOKEN);

             console.log("Form : "+ form);

             $.ajax({
                 type:'POST',
                 enctype: 'multipart/form-data',
                 url:'/inline_update_image',
                 async:false,
                 data:data,
                 processData: false,
                 contentType: false,
                 cache: false,
                 timeout: 600000,
                 success:function(data){
                     console.log("==== Updated inline value =====")
                     console.log(data);
                     $(elm).empty();
                     $(elm).append('<img src="'+data.path+'" id="'+data.path_u+'" alt="img" class="td_image">');
                     console.log("elm :- ");
                     console.log(elm);
                     $(elm).removeClass("inline_td");
                     inline_count = 0;
                     elm='';
                 }
             });


         });
         /** INLINE IMAGE EDITING SAVE END **/



         /* INLINE EDITING SAVE */
         $(document).on("click", "#saveinline", function(){
             var data = $(".inlinetxt").val();
             console.log("Key : "+key);
             console.log("Data : "+ data);
             $.ajax({
                 url:'/inlineedit',
                 type:'POST',
                 data:{csrfmiddlewaretoken: window.CSRF_TOKEN, id:key, d:data, base_id:$("thead").attr('id')},
                 success:function(data){
                     console.log("==== Updated inline value =====")
                     console.log(data);
                     for(i=0; i<data.rs_pk.length; i++)
                     {
                         $("#"+data.rs_pk[i]).text(data.rs_val[i]);
                     }
                 }
             });
             txt = $(".inlinetxt").val();
             $(elm).empty();
             $(elm).text(txt);
             $(elm).removeClass("inline_td");
             inline_count = 0;
             elm='';
         });
         /* INLINE EDITING SAVE END */

     }
     /* INLINE EDITING ENABLED FUNCTION*/

 });


     // /*COLUMN MENU OPTIONS*/
     // const menu = document.querySelector(".menu");
     // let menuVisible = false;

     // const toggleMenu = command => {
     //     menu.style.display = command === "show" ? "block" : "none";
     //     menuVisible = !menuVisible;
     // };

     // const setPosition = ({ top, left }) => {
     //     toggleMenu("show");
     // };

     // window.addEventListener("click", e => {
     //     if(menuVisible)toggleMenu("hide");
     // });

     // $("th").click(function(e){
     //     column_id = $(this).attr('id')
     //     e.preventDefault();
     //     setPosition(origin);
     //     return false;
     // });
     // /*COLUMN MENU OPTIONS END*/


     $(function() {
 var selected_row;
 var $contextMenu = $("#contextMenu");

 $("body").on("contextmenu", "table th", function(e) {
     column_id = $(this).attr("id");
    console.log(selected_row)

      $contextMenu.css({
           display: "block",
            left: e.pageX-20,
           top: e.pageY - 10

      });
      console.log(e.pageX);
      console.log(e.pageY);
      return false;
     //   $("th").click(function(e){
     //     column_id = $(this).attr('id')
     //     e.preventDefault();
     //     setPosition(origin);
     //     return false;
     // });
 });
$(".selectOption").click(function(){
 alert("row number "+selected_row+ " clicked")
})
 $('html').click(function() {
      $contextMenu.hide();
 });

});


     /*ROW MENU OPTIONS*/
     ids=[];
     col_val_names_sub_table = 0

     col_val_id_sub_table = 0

     const menu_rw = document.querySelector(".RW_menu");
     let menuVisible_rw = false;

     const toggleMenu_row = command => {
         menu_rw.style.display = command === "show" ? "block" : "none";
         menuVisible_rw = !menuVisible_rw;
     };

     const setPosition_row = ({ top, left }) => {
         menu_rw.style.left = `${left}px`;
         menu_rw.style.top = `${top}px`;
         toggleMenu_row("show");
     };

     window.addEventListener("click", e => {
         if(menuVisible_rw)toggleMenu_row("hide");
     });

     $("td").mousedown(function(e){
         if( e.button == 2 ) {

             col_val_names_sub_table = $(this).text();
             col_val_id_sub_table = $(this).attr('id');

             console.log("col_val_names_sub_table : " + col_val_names_sub_table);
             console.log("col_val_id_sub_table :  " + col_val_id_sub_table);

             var children = $(this).closest('tr').children('td');
             for (var i = 0, len = children.length ; i < len; i++) {
                 ids.push(children[i].id);
             }
             console.log(ids);
             row_id = $(this).attr('id')
             e.preventDefault();
             const origin = {
                 left: 300,
                 top: 300
             };
             setPosition_row(origin);
             return false;
         }
     });

     /*ROW MENU OPTIONS END*/

      /* FETCHING SUMTABLE RELATED TO MAIN TABLE */
     $(".additional_table").click(function(){
         console.log("===== SUB TABLE JS ======")
         var table_id = $(this).attr('id');
         sub_table_genaric_id = table_id;
         console.log("table_id : " + table_id)
         console.log("col_val_names_sub_table : " + col_val_names_sub_table)
         console.log("col_val_id_sub_table + " + col_val_id_sub_table)
         console.log("sub_table_genaric_id : " + sub_table_genaric_id);

         $(".addcol_additional").empty();
         $(".table_body_additional").empty();
         $(".new_row_btn_div").empty();

         $.ajax({
             type:"POST",
             url: "/Tables",
             data:{csrfmiddlewaretoken: window.CSRF_TOKEN, table_id:table_id, col_val_names_sub_table:col_val_names_sub_table, col_val_id_sub_table:col_val_id_sub_table},
             success: function( data )
             {
                 $(".sub_tables_main").attr('id', data.max_row);
                 var append_var = "<tr>";
                 console.log(data);
                 for(i=0; i<data.Cols.length; i++)
                 {
                     append_var = append_var + '<th id="' + data.Cols[i]["pk"] + '">' + data.Cols[i]["c_name"] + ' <img src="../static/images/trash.png" class="sub_tbl_col_delete" id="' + data.Cols[i]["pk"] +  '"> <img src="../static/images/edit.png" class="sub_tbl_col_edit" name="'+ data.Cols[i]["c_name"] +'" id="'+ data.Cols[i]["pk"] +'"></th>';

                 }
                 append_var = append_var + "</tr>"
                 $(".addcol_additional").append(append_var);


                 var append_body = "";
                 console.log("=====================");
                 console.log(data.Cols.length);
                 for(i=0; i<data.Details.length; i++)
                 {
                     console.log("=====================");
                     if((i>0) && (i % data.Cols.length == 0))
                     {
                         append_body = append_body +  '<td><button class="btn btn-sm btn-danger sub_table_row_delete" id="' + data.Details[i][2] + '">Delete</button></td>';
                         append_body = append_body +  '<td><button class="btn btn-sm btn-danger sub_table_row_edite" id="' + data.Details[i][2] + '">Edit</button></td>';

                         append_body = append_body + '</tr>';

                         append_body = append_body + '<tr>';
                     }
                     else if(i == 0)
                     {
                         append_body = append_body + '<tr>';
                     }

                    if(data.Details[i][3] == 'Image')
                     {

                         append_body = append_body + '<td id="' + data.Details[i][1] + '" class="sub_td"><img src="'+ data.Details[i][0] +'"class="td_image"></td>';
                     }
                     else
                     {
                         append_body = append_body + '<td id="' + data.Details[i][1] + '" class="sub_td">' + data.Details[i][0] + '</td>';
                     }

                 }
                 l = data.Cols.length - 1
                 if(data.Details.length > 0)
                 {
                     append_body = append_body + '<td><button class="btn btn-sm btn-danger sub_table_row_delete" id="' + data.Details[l][2] + '">Delete</button></td>';
                     append_body = append_body + '<td><button class="btn btn-sm btn-danger sub_table_row_edite" id="' + data.Details[l][2] + '">Edit</button></td></tr>';
                 }
                 $(".table_body_additional").append(append_body);
                 console.log(append_body)
                 $(".new_row_btn_div").append('<button class="btn btn-sm btn-danger new_row_add_sub_table">New Record</button>');
                 $(".new_row_btn_div").append('<button class="btn btn-sm btn-info sub_table_calcuation">Add Calc. column</button>');
                 $(".new_row_btn_div").append('<button class="btn btn-sm btn-primary sub_table_new_column" data-toggle="modal" data-target="#myModal1">Add new column</button>');
                 $(".new_row_btn_div").append('<button class="btn btn-sm btn-success sub_table_new_ref_column">Add Ref. column</button>');
                $(".new_row_btn_div").append('<button class="btn btn-sm btn-success sub_table_import"  data-toggle="modal" data-target="#importmod">Import</button>');


             }
         });

     });
     /* FETCHING SUMTABLE RELATED TO MAIN TABLE END */


     $("#sutable_click_menu").click(function(){
         var table_id = $('ul#sub_table_ul li:first').attr('id');
         sub_table_genaric_id = table_id;
         console.log("table_id : " + table_id)
         console.log("col_val_names_sub_table : " + col_val_names_sub_table)
         console.log("col_val_id_sub_table " + col_val_id_sub_table)
         console.log("sub_table_genaric_id : " + sub_table_genaric_id);

         $(".table_body_additional").empty();
         $(".addcol_additional").empty();
         $(".new_row_btn_div").empty();

          $.ajax({
             type:"POST",
             url: "/Tables",
             data:{csrfmiddlewaretoken: window.CSRF_TOKEN, table_id:table_id, col_val_names_sub_table:col_val_names_sub_table, col_val_id_sub_table:col_val_id_sub_table},
             success: function( data )
             {
                 console.log("++++++++++++++++++++++++++++++");
                 console.log(data);
                 $(".sub_tables_main").attr('id', data.max_row);
                 var append_var = "<tr>";

                 for(i=0; i<data.Cols.length; i++)
                 {
                     append_var = append_var + '<th id="' + data.Cols[i]["pk"] + '">' + data.Cols[i]["c_name"] + ' <img src="../static/images/trash.png" class="sub_tbl_col_delete" id="' + data.Cols[i]["pk"] +  '"> <img src="../static/images/edit.png" class="sub_tbl_col_edit" name="'+ data.Cols[i]["c_name"] +'" id="'+ data.Cols[i]["pk"] +'"></th>';
                 }
                 append_var = append_var + "<f/tr>"
                 $(".addcol_additional").append(append_var);

                 var append_body = "";
                 console.log("=====================");
                 console.log(data.Cols.length);
                 for(i=0; i<data.Details.length; i++)
                 {
                     console.log("=====================");
                     if((i>0) && (i % data.Cols.length == 0))
                     {
                         append_body = append_body +  '<td><button class="btn btn-sm btn-danger sub_table_row_delete" id="' + data.Details[i][2] + '">Delete</button></td>';
                         append_body = append_body +  '<td><button class="btn btn-sm btn-danger sub_table_row_edite" id="' + data.Details[i][2] + '">Edit</button></td>';
                         append_body = append_body + '</tr>';
                         append_body = append_body + '<tr>';

                     }
                     else if(i == 0)
                     {
                         append_body = append_body + '<tr>';

                     }

                     if(data.Details[i][3] == 'Image')
                     {

                         append_body = append_body + '<td id="' + data.Details[i][1] + '" class="sub_td"><img src="'+ data.Details[i][0] +'"class="td_image"></td>';
                     }
                     else
                     {
                         append_body = append_body + '<td id="' + data.Details[i][1] + '" class="sub_td">' + data.Details[i][0] + '</td>';
                     }



                 }
                 l = data.Cols.length - 1
                 if(data.Details.length > 0)
                 {
                     append_body = append_body + '<td><button class="btn btn-sm btn-danger sub_table_row_delete" id="' + data.Details[l][2] + '">Delete</button></td>';
                     append_body = append_body + '<td><button class="btn btn-sm btn-danger sub_table_row_edite" id="' + data.Details[l][2] + '">Edit</button></td></tr>';
                 }
                 $(".table_body_additional").append(append_body);
                 if(data.Cols.length > 0)
                 {
                     $(".new_row_btn_div").append('<button class="btn btn-sm btn-danger new_row_add_sub_table">New Record</button>');
                 }
                 $(".new_row_btn_div").append('<button class="btn btn-sm btn-info sub_table_calcuation">Add Calc. column</button>');
                 $(".new_row_btn_div").append('<button class="btn btn-sm btn-primary sub_table_new_column" data-toggle="modal" data-target="#myModal1">Add new column</button>');
                 $(".new_row_btn_div").append('<button class="btn btn-sm btn-success sub_table_new_ref_column">Add Ref. column</button>');
                  $(".new_row_btn_div").append('<button class="btn btn-sm btn-success sub_table_import"  data-toggle="modal" data-target="#importmod">Import</button>');


                 console.log(append_body)

             }
         });
     });

     /*ROW DUPLICATE FUNCTION*/
     $("#row_dup").click(function(e){
         var relation = $("th").map(function(){return $(this).attr('id');}).get();
         console.log("relation:"+relation)
         var mx = $(".table_body").attr('id')
         console.log("row :" + mx)
         console.log("ids :" + ids)
         console.log("ids.length"+ids.length)
         var imp = 1;

         for(i =0; i<ids.length; i++)
         {
             var txt = $('#'+ids[i]).text();
             $.ajax({
                 url: '/adddetails',
                 type: 'POST',
                 data:{csrfmiddlewaretoken: window.CSRF_TOKEN, d1: txt, rr:relation[i], mx:mx, table_id:$("thead").attr('id'),imp:imp},
                 success: function (res) {},
                 error: function (err) {
                     console.log(err);
                 }
             });
         }

         setTimeout(function(){
             location.reload();
         }, 2000);
         return false;
     });
     /*ROW DUPLICATE FUNCTION END*/

     /*ROW DELETE FUNCTION*/
     $("#row_delete").click(function(e){
         for(i =0; i<ids.length; i++)
         {
             $.ajax({
                 url: '/delete_row',
                 type: 'POST',
                 data: {csrfmiddlewaretoken: window.CSRF_TOKEN ,id:ids[i],base_id:$("thead").attr('id')},
                 success: function (res) {},
                 error: function (err) {
                     console.log(err);
                 }
             });
         }
         setTimeout(function(){
             location.reload();
         }, 2000);
         return false;
         return true;
     });
     /*ROW DELETE FUNCTION END*/

     column_id=0;
     // ids = [];
     txts = [];

     /*COLUMN DELETE FUNCTION*/
     $("#col_delete").mousedown(function(ev){

         $.ajax({
             url: '/deletecolumn',
             type: 'POST',

             data: {csrfmiddlewaretoken: window.CSRF_TOKEN,id:column_id,base_id:$("thead").attr('id')},
             success: function (res) {
                 console.log(res);
             },
             error: function (err) {
               console.log(err);
             }
         });
         column_id=0;
         //setTimeout(function(){location.reload();}, 2000);
     });
     /*COLUMN DELETE FUNCTION  END*/

     /*COLUMN RENAME FUNCTION*/
     $("#col_edite").mousedown(function(ev){
         $(".col_md_rn").attr('id', column_id)
         $(".col_md_rn").val($("#"+column_id).text());
         $('#rmodal').modal('show');
         column_id=0;
     });

     $("#btn_rn").click(function(){
         id = $(".col_md_rn").attr('id');
         m = $(".col_md_rn").val();
         console.log(id);
         console.log(m);
         $.ajax({
             url: '/edit_column',
             type: 'POST',
             async: false,
             data: {csrfmiddlewaretoken: window.CSRF_TOKEN,id:id, val:m, base_id:$("thead").attr('id')},
             success: function (data) {
                 console.log(data);
             },
             error: function (err) {
                 console.log(err);
             }
         });

         if(check_sub_table_or_main == 1)
         {
             $(".cal_sign_box").empty();
             var bts = '<button class="btn btn-info btn-oprator" id="+">+</button><button class="btn btn-primary btn-oprator" id="-">-</button><button class="btn btn-danger btn-oprator" id="*">*</button><button class="btn btn-warning btn-oprator" id="/">/</button><button class="btn btn-success btn-oprator" id="%">%</button><button class="btn btn-success btn-oprator" id=">">Max</button><button class="btn btn-success btn-oprator" id="<">Min</button> <button class="btn btn-success btn-bracket" id="(">(</button><button class="btn btn-success btn-bracket" id=")">)</button>'
             $(".cal_sign_box").append(bts);
             var table_id = sub_table_genaric_id;
             console.log("table_id : " + table_id)
             console.log("col_val_names_sub_table : " + col_val_names_sub_table)
             console.log("col_val_id_sub_table + " + col_val_id_sub_table)
             console.log("sub_table_genaric_id : " + sub_table_genaric_id);

             $(".addcol_additional").empty();
             $(".table_body_additional").empty();
             $(".new_row_btn_div").empty();

             $.ajax({
                 type:"POST",
                 url: "/Tables",
                 data:{csrfmiddlewaretoken: window.CSRF_TOKEN, table_id:table_id, col_val_names_sub_table:col_val_names_sub_table, col_val_id_sub_table:col_val_id_sub_table},
                 success: function( data )
                 {
                     $(".sub_tables_main").attr('id', data.max_row);
                     var append_var = "<tr>";
                     console.log(data);
                     for(i=0; i<data.Cols.length; i++)
                     {
                         append_var = append_var + '<th id="' + data.Cols[i]["pk"] + '">' + data.Cols[i]["c_name"] + ' <img src="../static/images/trash.png" class="sub_tbl_col_delete" id="' + data.Cols[i]["pk"] +  '"> <img src="../static/images/edit.png" class="sub_tbl_col_edit" name="'+ data.Cols[i]["c_name"] +'" id="'+ data.Cols[i]["pk"] +'"></th>';

                     }
                     append_var = append_var + "</tr>"
                     $(".addcol_additional").append(append_var);
                     $(".new_row_btn_div").append('<button class="btn btn-sm btn-danger new_row_add_sub_table">New Record</button>');
                     $(".new_row_btn_div").append('<button class="btn btn-sm btn-info sub_table_calcuation">Add Calc. column</button>');
                     $(".new_row_btn_div").append('<button class="btn btn-sm btn-primary sub_table_new_column" data-toggle="modal" data-target="#myModal1">Add new column</button>');
                     $(".new_row_btn_div").append('<button class="btn btn-sm btn-success sub_table_new_ref_column">Add Ref. column</button>');
                    $(".new_row_btn_div").append('<button class="btn btn-sm btn-success sub_table_import"  data-toggle="modal" data-target="#importmod">Import</button>');

                     var append_body = "";
                     console.log("=====================");
                     console.log(data.Cols.length);
                     for(i=0; i<data.Details.length; i++)
                     {
                         console.log("=====================");
                         if((i>0) && (i % data.Cols.length == 0))
                         {
                             append_body = append_body +  '<td><button class="btn btn-sm btn-danger sub_table_row_delete" id="' + data.Details[i][2] + '">Delete</button></td>';
                             append_body = append_body +  '<td><button class="btn btn-sm btn-danger sub_table_row_edite" id="' + data.Details[i][2] + '">Edit</button></td>';

                             append_body = append_body + '</tr>';

                             append_body = append_body + '<tr>';
                         }
                         else if(i == 0)
                         {
                             append_body = append_body + '<tr>';
                         }

                        append_body = append_body + '<td id="' + data.Details[i][1] + '" class="sub_td">' + data.Details[i][0] + '</td>';

                     }
                     l = data.Cols.length - 1
                     append_body = append_body + '<td><button class="btn btn-sm btn-danger sub_table_row_delete" id="' + data.Details[l][2] + '">Delete</button></td>';
                     append_body = append_body + '<td><button class="btn btn-sm btn-danger sub_table_row_edite" id="' + data.Details[l][2] + '">Edit</button></td></tr>';

                     $(".table_body_additional").append(append_body);
                     console.log(append_body)

                 }
             });
         }
         else
         {
             setTimeout(function(){location.reload();}, 2000);
         }
     });
     /*COLUMN RENAME FUNCTION  END*/

     document.addEventListener('contextmenu', function(e) {
         e.preventDefault();
     });


     /* TO DESABLE RIGHT CLICK MENU  */
     window.addEventListener("click", e => {
         if(menuVisible)toggleMenu("hide");
     });
 });


$(document).ready(function(){
 $("#btnExport").click(function() {
     let table = document.getElementsByTagName("table");
     TableToExcel.convert(table[0], { // html code may contain multiple tables so here we are refering to 1st table tag
     name: `export.xlsx`, // fileName you could use any name
     title: 'Excel',
     sheet: {
         name: 'Sheet 1' // sheetName
     }

     });
});
});



function demoFromHTML() {
 var pdf = new jsPDF('p', 'pt', 'letter');
 // source can be HTML-formatted string, or a reference
 // to an actual DOM element from which the text will be scraped.
 source = $('#customers')[0];

 // we support special element handlers. Register them with jQuery-style
 // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
 // There is no support for any other type of selectors
 // (class, of compound) at this time.
 specialElementHandlers = {
     // element with id of "bypass" - jQuery style selector
     '#bypassme': function (element, renderer) {
         // true = "handled elsewhere, bypass text extraction"
         return true
     }
 };

 margins = {
     top: 80,
     bottom: 60,
     left: 10,
     width: 700
 };

 // all coords and widths are in jsPDF instance's declared units
 // 'inches' in this case
 pdf.fromHTML(
     source, // HTML string or DOM elem ref.
     margins.left, // x coord
     margins.top, { // y coord
     'width': margins.width, // max width of content on PDF
     'elementHandlers': specialElementHandlers
     },
     function (dispose) {
         // dispose: object with X, Y of the last line add to the PDF
         // this allow the insertion of new lines after html
         pdf.save('Test.pdf');
     }, margins);

}


//ADD IN ROW FUNCTION //
$(".newrow_add").click(()=>{
 relation =[];
 row_val= [];

 var relation = $(".table_body tr:first td").map(function(){return $(this).attr('id');}).get();
 var row_val =$(".table_body tr:first td").map(function(){return $(this).text().trim();}).get();

 console.log("relation:"+relation)
 console.log("row_val:"+row_val)
 console.log(relation.length)
  $('.newrow_add_btn').attr("disabled", true);
 var st ='<tr>';

 for(i=0;i<relation.length;i++)
 {
     $.ajax({
       url:'/inline_type',
       type:'POST',
       async: false,
       data:{csrfmiddlewaretoken: window.CSRF_TOKEN, key:relation[i], base_id:$("thead").attr('id')},
       success:function(data)
           {
               console.log('-------------------------------------------');
               console.log(data)

               if (data.Result[0].d_type.trim() == 'Date')
               {
                   inline_type = 'Date';

               }
               else if (data.Result[0].d_type.trim() == 'Time')
               {
                     inline_type = 'Time';
               }
               else if(data.Result[0].d_type.trim() == 'Calc')
               {
                   inline_type = 'Calc';
               }
               else if(data.Result[0].d_type.trim() == 'Text' || data.Result[0].d_type.trim() == 'Numeric'|| data.Result[0].d_type.trim() == 'Number'|| data.Result[0].d_type.trim() == 'String')
               {
                   inline_type = 'text';
               }
               else if(data.Result[0].d_type.trim() == 'Image')
               {
                   inline_type = 'File';
               }
               else
               {
                   inline_type ="select"
               }
                console.log("Inline Type : "+ inline_type);


               if(inline_type == 'select')
               {
                   st = st + '<td><select class="inlinetxt form-control rr detailid_clone select22 select_liner_data" id="'+data.Result[0].pk+'" name="'+data.Result[0].nul_type+'">';
                   console.log("*******************");
                   console.log(data.Relation)
                   console.log(data.Relation.length);
                   for(j=0; j<data.Relation.length; j++)
                   {
                       console.log(data.Relation[i])
                       st = st + '<option value="'+data.Relation[j]+'" name="'+data.row[j]+'">'+data.Relation[j]+'</option>';
                   }
                   st = st + '</select></td>';

               }
               else if(inline_type == 'Calc')
               {
                 st = st + '<td><input type="text" class="inlinetxt detailid_clc_clone_add_row form-control" id="'+data.Result[0].pk+'" disabled></td>';
               }
               else if(inline_type == 'File')
               {
                 st = st + '<td><form method="POST" enctype="multipart/form-data" class="Inline_new_row_fileUploadForm_images_data" name="'+data.Result[0].nul_type+'"><input type="file" class="inlinetxt Inline_new_row_detailid_add_new_image  form-control" name="files" id="'+data.Result[0].pk+'"></form></td>';
               }
               else
               {
                   st = st + '<td><input type="'+inline_type+'" class="inlinetxt detailid_clone form-control" id="'+data.Result[0].pk+'" name="'+data.Result[0].nul_type+'"></td>';

               }
           }
     });
 }

 st=st+'</tr>';
 console.log("ST IS : ");
 console.log(st);
 $(".table_body").append(st);
  $('.select22').select2();
 $('.table_body').append('<button class="cloned_row_add btn btn-primary">Save</button>')

});



$(document).on('click','.cloned_row_add',function(){
 event.preventDefault();
 validation_checker = false;

 var values = $(".detailid_clone").map(function(){
                                                     if(($(this).val() == "" || $(this).val() == "Select..") && ($(this).attr('name') == "NOTNULL"))
                                                     {
                                                         $(this).css({'border':'1px solid #d1383d'});
                                                         validation_checker = true;
                                                     }
                                                     else
                                                     {
                                                         $(this).css({'border':'1px solid green'});
                                                     }
                                                     return $(this).val();
                                                 }).get();

 $(".Inline_new_row_detailid_add_new_image").map(function(){
                                                 if($(this).val() == "" && $(this).closest('form').attr('name') == "NOTNULL")
                                                 {
                                                     $(this).css({'border':'1px solid #d1383d'});
                                                     validation_checker = true;
                                                 }
                                                 else
                                                 {
                                                     $(this).css({'border':'1px solid green'});
                                                 }
                                                 }).get();

 var relation = $(".detailid_clone").map(function(){return $(this).attr('id');}).get();
 var mx = $(".table_body").attr('id')
 var table_id = $("thead").attr('id');
 var imp = 0;
 console.log('Table id : ' + table_id);
 console.log('Row Maximum id : '+mx);
 console.log("Values : "+values);
 console.log("Relation : "+relation)

 if(validation_checker != true)
 {
     /** UPDATING NORMAL COLUMNS VALUES **/
     for(i =0; i<values.length; i++)
     {
         if (i == values.length - 1)
         {
             imp = 1;
         }
         console.log("IMP : " + imp);
         $.ajax({
             type:"POST",
             url: "/adddetails",
             async:false,
             data:{csrfmiddlewaretoken: window.CSRF_TOKEN, d1: values[i], rr:relation[i], mx:mx , table_id:table_id, imp:imp},
             success: function( data ){
                 console.log(data);
                  $('.newrow_add_btn').attr("disabled", false);
             }
         });
     }
    /** UPDATING NORMAL COLUMNS VALUES END **/

    /** Image data upload **/
    console.log("--- Uploading Images ---")
    var image_columns_id = $(".Inline_new_row_detailid_add_new_image").map(function(){return $(this).attr('id');}).get();
    var form_data_image = $(".Inline_new_row_fileUploadForm_images_data").map(function(){return $(this)[0];}).get();
    console.log("image_columns_id : - ");
    console.log(image_columns_id);
    console.log("form_data_image : -");
    console.log(form_data_image);
    for(i=0; i<image_columns_id.length; i++)
    {
         var form = form_data_image[i];
         var data = new FormData(form);
         data.append("id",$("thead").attr('id'));
         data.append('max_row', $(".table_body").attr('id'));
         data.append('image_columns_id', image_columns_id[i]);
         data.append('csrfmiddlewaretoken', window.CSRF_TOKEN);
         $.ajax({
             type:"POST",
             enctype: 'multipart/form-data',
             url: "/data_image_upload",
             async:false,
             data:data,
             processData: false,
             contentType: false,
             cache: false,
             timeout: 600000,
             success: function( data ){
               console.log(data);
             }
         });
    }
    /** Image data upload end **/

    /** UPDATING CALCULATION COLUMNS VALUES **/
    console.log("======== Add Detaild Calc Value ========")
    var relation_clc = $(".detailid_clc_clone_add_row").map(function(){return $(this).attr('id');}).get();
    console.log("calc IDS : "+relation_clc);
    for(i=0; i<relation_clc.length; i++)
    {
         $.ajax({
             type:"POST",
             url: "/cal_add_details",
             async:false,
             data:{csrfmiddlewaretoken: window.CSRF_TOKEN, mx:mx, base_id:event.target.id, relation_clc:relation_clc[i], d1: values, rr:relation},
             success: function( data ){
               console.log(data);
             }
         });
     }
    /** UPDATING CALCULATION COLUMNS VALUES END **/

    setTimeout(function(){location.reload();}, 2000);

 }
 else
 {
     new Noty({
        type: 'error',
        layout: 'topRight',
        theme: 'metroui',
        text: 'Required fields cannot be empty. ! 🤖',
        timeout: '4000',
        progressBar: true,
        closeWith: ['click'],
        killer: true,

     }).show();
 }






});




/*BASE TRUNCATE FUNCTION*/
function datadel(event){
 console.log(event.target.id)
 var id = event.target.id
 var message = 'Are You Sure Do you want to Delete all Records?';
 $(".messagetxt").text(message);
 $('#messagebox').modal('show');

 $("#btnconfirm").click(function(){
     $.ajax({
         url: '/deletedetails',
         type: 'POST',
         data: {csrfmiddlewaretoken: window.CSRF_TOKEN, id: id},
         success: function (res){
             $('#' + id).remove();
         },
         error: function (err)
         {
             console.log(err);
         }
     });
     setTimeout(function(){location.reload();}, 2000);
 });
}
/*BASE DELETE FUNCTION END*/




/*BASE DELETE FUNCTION*/
function delbase(event){
 var message = 'Are you sure you want to delete the selected table?';
 $(".messagetxt").text(message);
 $('#messagebox').modal('show');
 console.log( event.target.id)
 var id = event.target.id
 $("#btnconfirm").click(function(){
     $.ajax({
         url: '/deletebase',
         type: 'POST',
         async: false,
         data: {csrfmiddlewaretoken: window.CSRF_TOKEN, id:id},
         success: function (res) {
             $('#' + id).remove();
             window.location.href = "/index";
         },
         error: function (err) {
             console.log(err);
         }
     });
     setTimeout(function(){location.reload();}, 2000);
 });
}
/*BASE DELETE FUNCTION END*/


/* to keep dropdown open while click inside */

 $(document).on('click', '.dropdown-menu', function (e) {
     e.stopPropagation();
 });


/* to keep dropdown open while click inside end */


//FILTER FUNCTION//
fvalues=[]
$('.filter-option').on('click',function(){
 $(this).addClass("selectedoption")

//    console.log($(this).html())
fvalues.push($(this).html())

});



$('.tablefilter').click(()=>{
 console.log(fvalues)
 $('.filter-option').removeClass('selectedoption')
 // $('#fiter-dropdown').slideUp();

 console.log($('thead').attr('id'))
 b_id=$('thead').attr('id')

 var sr = '';

 $.ajax({
   url: '/colfilter',
   type: 'POST',

   data: {csrfmiddlewaretoken: window.CSRF_TOKEN,base_id:$("thead").attr('id'),col_values:fvalues,v_length:fvalues.length},

   success: function (data) {
     $('#demo').empty();
     $(".mega-dropdown-menu").addClass('ff_filter')
       console.log('=== DATA ===');
       console.log(data.mylist[0]);
       console.log(data.mylist[0][0]);
       console.log(data.col_names[0]);
       console.log(b_id)
       sr=sr+'<thead id="'+data.col_names[0].base_fk+'" class="addcol">'
       sr=sr+'<tr>'
       for(i=0;i<data.col_names.length;i++){
       sr=sr + '<th id="'+data.col_names[i].pk+'">'+data.col_names[i].c_name+'</th>'
       }
       sr=sr+"</tr>"
       sr=sr+'</thead>'

       sr=sr+'<tbody id="'+data.max_row+'" class="table_body">'

       sr=sr+'<tr id="0">'
       console.log("LENGTH");

       console.log(data.mylist.length);
       for(i=0;i<data.mylist.length;i++){

         console.log(data.mylist[i][0])

         if(i != 0 && i % data.bc == 0 && i != data.mylist_length )
           {

          sr = sr + '</tr><tr id="'+data.mylist[i][2]+'">';
          sr=sr +'<td id="'+data.mylist[i][1]+'">'+data.mylist[i][0]+'</td>'

         }
         else
         {

             sr=sr +'<td id="'+data.mylist[i][1]+'">'+data.mylist[i][0]+'</td>'
         }


       }
         sr=sr+"</tr>"
          sr=sr+'</tbody>'


          function empty() {
             //empty your array
             fvalues = [];
         }
         empty();

      $('#demo').append(sr);


 },
   error: function (err) {
     console.log(err);
   }
 });


})



//FILTER FUNCTION END//

 $(".usergroupdel").click(function(e){
 console.log(e.target.id)
 // console.log($('.tbl_name').val())
 $.ajax({
     url: '/deletegroup',
     type: 'POST',

     data: {csrfmiddlewaretoken: window.CSRF_TOKEN,group_id:e.target.id},
     success: function (data){
     console.log(data)
     },

  });
 });

 $(document).on('click','.sub_table_import',function(){
 check_sub_table_or_main = 1;
 });

$(document).ready(function () {

 $("#btnSubmit").click(function (event) {

     //stop submit the form, we will post it manually.
     event.preventDefault();

     // Get form
     var form = $('#fileUploadForm')[0];

     // Create an FormData object
     var data = new FormData(form);

     // If you want to add an extra field for the FormData
      if (check_sub_table_or_main == 1)
      {

          console.log('sub_table_id'+sub_table_genaric_id)
          console.log('maxrow'+$(".sub_tables_main").attr('id'))
         data.append("id",sub_table_genaric_id);
         data.append('max_row', $(".sub_tables_main").attr('id'));
      }
      else
      {
         data.append("id",$("thead").attr('id'));
         data.append('max_row', $(".table_body").attr('id'));

      }


     // disabled the submit button
     $("#btnSubmit").prop("disabled", true);

     $.ajax({
         type: "POST",
         enctype: 'multipart/form-data',
         url: "/importx",
         data: data,
         processData: false,
         contentType: false,
         cache: false,
         timeout: 600000,
         success: function (data) {

            console.log(data)
            $('#importmod').hide()
         },
         error: function (e) {


         }
     });setTimeout(function(){
         location.reload();
       }, 2000);


 });

});

///////////////////////drag column////////////////////////////////////////
var Anterec;
(function (Anterec) {
 var JsDragTable = (function () {
     function JsDragTable(target) {
         this.offsetX = 5;
         this.offsetY = 5;
         this.container = target;
         this.rebind();
     }
     JsDragTable.prototype.rebind = function () {
         var _this = this;
         $(this.container).find("th").each(function (headerIndex, header) {
             $(header).off("mousedown touchstart");
             $(header).off("mouseup touchend");
             $(header).on("mousedown touchstart", function (event) {
                 _this.selectColumn($(header), event);
             });
             $(header).on("mouseup touchend", function (event) {
                 _this.dropColumn($(header), event);
             });
         });
         $(this.container).on("mouseup touchend", function () {
             _this.cancelColumn();
         });
     };

     JsDragTable.prototype.selectColumn = function (header, event) {
         var _this = this;
         event.preventDefault();
         var userEvent = new UserEvent(event);
         this.selectedHeader = header;
         var sourceIndex = this.selectedHeader.index() + 1;
         var cells = [];

         $(this.container).find("tr td:nth-child(" + sourceIndex + ")").each(function (cellIndex, cell) {
             cells[cells.length] = cell;
         });

         this.draggableContainer = $("<div/>");
         this.draggableContainer.addClass("jsdragtable-contents");
         this.draggableContainer.css({ position: "absolute", left: userEvent.event.pageX + this.offsetX, top: userEvent.event.pageY + this.offsetY });

         var dragtable = this.createDraggableTable(header);

         $(cells).each(function (cellIndex, cell) {
             var tr = $("<tr/>");
             var td = $("<td/>");
             $(td).html($(cells[cellIndex]).html());
             $(tr).append(td);
             $(dragtable).find("tbody").append(tr);
         });

         this.draggableContainer.append(dragtable);
         $("body").append(this.draggableContainer);
         $(this.container).on("mousemove touchmove", function (event) {
             _this.moveColumn($(header), event);
         });
         $(".jsdragtable-contents").on("mouseup touchend", function () {
             _this.cancelColumn();
         });
     };

     JsDragTable.prototype.moveColumn = function (header, event) {
         event.preventDefault();
         if (this.selectedHeader !== null) {
             var userEvent = new UserEvent(event);
             this.draggableContainer.css({ left: userEvent.event.pageX + this.offsetX, top: userEvent.event.pageY + this.offsetY });
         }
     };

     JsDragTable.prototype.dropColumn = function (header, event) {
         var _this = this;
         event.preventDefault();
         var sourceIndex = this.selectedHeader.index() + 1;
         var targetIndex = $(event.target).index() + 1;
         var tableColumns = $(this.container).find("th").length;

         var userEvent = new UserEvent(event);
         if (userEvent.isTouchEvent) {
             header = $(document.elementFromPoint(userEvent.event.clientX, userEvent.event.clientY));
             targetIndex = $(header).prevAll().length + 1;
         }

         if (sourceIndex !== targetIndex) {
             var cells = [];
             $(this.container).find("tr td:nth-child(" + sourceIndex + ")").each(function (cellIndex, cell) {
                 cells[cells.length] = cell;
                 $(cell).remove();
                 $(_this.selectedHeader).remove();
             });

             if (targetIndex >= tableColumns) {
                 targetIndex = tableColumns - 1;
                 this.insertCells(cells, targetIndex, function (cell, element) {
                     $(cell).after(element);
                 });
             } else {
                 this.insertCells(cells, targetIndex, function (cell, element) {
                     $(cell).before(element);
                 });
             }

             $(this.container).off("mousemove touchmove");
             $(".jsdragtable-contents").remove();
             this.draggableContainer = null;
             this.selectedHeader = null;
             this.rebind();
         }
     };

     JsDragTable.prototype.cancelColumn = function () {
         $(this.container).off("mousemove touchmove");
         $(".jsdragtable-contents").remove();
         this.draggableContainer = null;
         this.selectedHeader = null;
     };

     JsDragTable.prototype.createDraggableTable = function (header) {
         var table = $("<table/>");
         var thead = $("<thead/>");
         var tbody = $("<tbody/>");
         var tr = $("<tr/>");
         var th = $("<th/>");
         $(table).addClass($(this.container).attr("class"));
         $(table).width($(header).width());
         $(th).html($(header).html());
         $(tr).append(th);
         $(thead).append(tr);
         $(table).append(thead);
         $(table).append(tbody);
         return table;
     };

     JsDragTable.prototype.insertCells = function (cells, columnIndex, callback) {
         var _this = this;
         $(this.container).find("tr td:nth-child(" + columnIndex + ")").each(function (cellIndex, cell) {
             callback(cell, $(cells[cellIndex]));
         });
         $(this.container).find("th:nth-child(" + columnIndex + ")").each(function (cellIndex, cell) {
             callback(cell, $(_this.selectedHeader));
         });
     };
     return JsDragTable;
 })();
 Anterec.JsDragTable = JsDragTable;

 var UserEvent = (function () {
     function UserEvent(event) {
         this.event = event;
         if (event.originalEvent && event.originalEvent.touches && event.originalEvent.changedTouches) {
             this.event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
             this.isTouchEvent = true;
         }
     }
     return UserEvent;
 })();
})(Anterec || (Anterec = {}));
jQuery.fn.extend({
 jsdragtable: function () {
     return new Anterec.JsDragTable(this);
 }
});


/* TO HIDE SIZE FIELD  IN NEW COLUMN CREATION MODEL*/
$('.newcoltype').on('change',function(){
 dtype = $('.newcoltype option:selected').html()
 console.log(dtype);
 if (dtype == 'Date' || dtype == 'Time' || dtype == 'Image')
 {
     $('.newcolsize').hide();
 }
 else
 {
     $('.newcolsize').show();
 }
});

$('.btn-truncate-tables').click(function(){
 $.ajax({
     url:'/truncate_tables',
     type:'POST',
     data:{csrfmiddlewaretoken: window.CSRF_TOKEN},
     success:function(data){
         console.log(data)
     }

 });setTimeout(function(){
     location.reload();
   }, 2000);
})

$('.btn-delete-tables').click(function(){
 $.ajax({
     url:'/delete_tables',
     type:'POST',
     data:{csrfmiddlewaretoken: window.CSRF_TOKEN},
     success:function(data){
         console.log(data)
     }

 });setTimeout(function(){
     location.reload();
   }, 2000);
});

$('.btn-delete-users').click(function(){
 $.ajax({
     url:'/delete_users',
     type:'POST',
     data:{csrfmiddlewaretoken: window.CSRF_TOKEN},
     success:function(data){
         console.log(data)
     }

 });setTimeout(function(){
     location.reload();
   }, 2000);
})

/* TO DISABLE MULTIPLE CHECKBOX SELECT IN ACCOUNT_ DISABLE */
$('.check input:checkbox').click(function() {
 $('.check input:checkbox').not(this).prop('checked', false);
});
/* TO DISABLE MULTIPLE CHECKBOX SELECT IN ACCOUNT_ DISABLE */

//modeldetailedit

$('#tblsel').on('change',function(e){

console.log($("#tblsel option:selected").val());
base_id=$("#tblsel option:selected").val();

$.ajax({
 url:'/load_detailsfetch',
 type:'POST',
 data:{csrfmiddlewaretoken: window.CSRF_TOKEN,base_id:base_id},

 success:function(data) {
     console.log(data)

     $("#base_name").val(data.Result[0]['base_name'])
     $("#technical_name").val(data.Result[0]['technical_name'])
     $("#ttype").val(data.Result[0]['table_type'])
     $("#discription").val(data.Result[0]['discription'])
     $("#purpose").val(data.Result[0]['purpose'])
     $("#bcp").val(data.Result[0]['bcp'])
     $("#tagss").val(data.Result[0]['tags'])



 },

});



});

$(".btn_update_details").click(function(){

 var tbl_id = $("#tblsel option:selected").val();
 console.log(tbl_id)
 var base_name = $("#base_name").val();
 console.log(base_name)
 var technical_name =  $("#technical_name").val();
 console.log(technical_name)
 var ttype =  $("#ttype").val();
 console.log(ttype)
 var discription =  $("#discription").val();
 console.log(discription)
 var purpose =  $("#purpose").val();
 console.log(purpose)
 var bcp =  $("#bcp").val();
 console.log(bcp)
 var tagss =  $("#tagss").val();
 console.log(tagss)

 $.ajax({
     type:"POST",
     url: "/detail_update",
     data:{csrfmiddlewaretoken: window.CSRF_TOKEN, tbl_id:tbl_id, base_name:base_name,technical_name:technical_name,ttype:ttype,discription:discription,purpose:purpose,bcp:bcp,tagss:tagss},
     success: function(data)
     {
         console.log(data);

     },
     error:function(er){
     console.log(er)
     }
 });
 setTimeout(function()
{
 location.reload();
}, 2000);
});
//modeldetailedit end

/*Dashboard fetching xand y axis values */
$('#table_name').on('change',function(){
base_id = $('#table_name option:selected').val()
console.log(base_id)
$.ajax({
 url:'/load_reportpagefetch',
 type:'POST',
 data:{csrfmiddlewaretoken: window.CSRF_TOKEN,base_id:base_id},

 success:function(data) {
     console.log(data)
     console.log(data.data.length)
     $(".axisvalues").empty()
    $(".axisvalues").append('<option value="0">Select...</option>');
     for(i=0;i<data.data.length;i++)
     {
     $('.axisvalues').append('<option value="'+data.data[i].pk+'">'+data.data[i].c_name+'</option>')
    }
 }
});
});
/*Dashboard fetching xand y axis values end */
/** Create Chart-Dashboard */

var chart_type;
var y_label;
var dataLength;

$('.createchart').click(function(){
var xvalues=[]
var yvalues=[]
var ctx = document.getElementById('myChart').getContext("2d");

chart_name=$('.chart_name').val()
dchart_name=$('.dchart_name').val()
table_name=$('#table_name option:selected').val()
xaxis=$('#X-axis option:selected').val()
yaxis=$('#Y-axis option:selected').val()
y_label=$('#Y-axis option:selected').html()
x_label=$('#X-axis option:selected').html()
chart_type=$('#chart_type option:selected').val()
console.log(chart_name)
console.log(dchart_name)
console.log(table_name)
console.log(xaxis)
console.log(yaxis)
console.log(chart_type)
$.ajax({
   url:'/chartdata_fetch',
   type:'POST',
   data:{csrfmiddlewaretoken: window.CSRF_TOKEN,base_id:table_name,x_axis:xaxis,yaxis:yaxis},

   success:function(data) {

     dataLength=data.x_axis.length
      /* Create color array */

     var COLORS = interpolateColors(dataLength, colorScale, colorRangeInfo);

       for(i=0;i<data.x_axis.length;i++)
       {
       console.log(data.x_axis[0].c_v)
       xvalues.push(data.x_axis[i].c_v)
       yvalues.push(data.y_axis[i].c_v)
      }
      console.log('xvalues'+ xvalues)
      console.log('yvalues'+ yvalues)


       var myChart = new Chart(ctx, {
            responsive: false,
            width:100,
            height:100,
            type: chart_type,
            data: {
                labels: xvalues,
                datasets: [{
                    label: '# of'+y_label,
                    data:yvalues ,
                    backgroundColor:COLORS,
                 //    barThickness: 18,
                    borderColor:COLORS,
                    fill: false,


                    borderWidth: 1
                }]
            },
            options: {
                    title: {
                            display: true,
                            text: dchart_name,
                            fontStyle:'bold',
                            position:'top',
                            fontSize:16,
                            fontFamily:'Helvetica Neue',
                         },
                    layout:{
                            padding: {
                            left: 100,
                            right: 0,
                            top: 0,
                            bottom: 0
                            }
                        },
                    legend: {
                            display: true,
                            labels: {
                             //    fontColor: 'rgb(255, 99, 132)'
                            }
                        },


                    scales: {
                             yAxes: [{
                                 display:true,
                                labelString:y_label,
                                stacked: true,
                                ticks: {
                                    beginAtZero: true
                                },
                                 scaleLabel: {
                                 display: true,
                                 labelString: y_label
                               }
                            }],
                             xAxes:[{
                             scaleLabel: {
                                 display: true,
                                 labelString: x_label
                               }
                            }]
                            }
            }
        });

    }

});

});
/** Create Chart-Dashboard */

/* Dynamic color pic functions*/

/* Must use an interpolated color scale, which has a range of [0, 1] */
const colorRangeInfo = {
         colorStart: 0,
         colorEnd: 1,
         useEndAsStart:  Boolean,
      }


function interpolateColors(dataLength, colorScale, colorRangeInfo) {
 var { colorStart, colorEnd } = colorRangeInfo;
 var colorRange = colorEnd - colorStart;
 var intervalSize = colorRange / dataLength;
 var i, colorPoint;
 var colorArray = [];


 for (i = 0; i < dataLength; i++) {
   colorPoint = calculatePoint(i, intervalSize, colorRangeInfo);
   console.log("colorPoint"+colorPoint)
   colorArray.push(colorScale(colorPoint));

 }

 return colorArray;
}

function calculatePoint(i, intervalSize, colorRangeInfo) {
 var { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
 return (useEndAsStart
   ? (colorEnd - (i * intervalSize))
   : (colorStart + (i * intervalSize)));
}

function colorScale(colorPoint){

 return(
 d3.interpolateRgb("red", "blue")(colorPoint)

 )
}

/* Dynamic color pic functions*/

// <!--Edit-->


$('#row_copy').click(()=>{

 row_val=[];
 relation=[];
 $('#myModal2').modal('show');
 $('.copy_details').empty()
 var mx = $(".table_body").attr('id')
 var relation = $("th").map(function(){return $(this).attr('id');}).get();
 console.log("relation:"+relation)
 console.log('ids'+ids)
 console.log('row_num'+mx)
 console.log("relation_length:"+relation.length)
 for(i=0;i<relation.length;i++)
 {
     var txt = $('#'+ids[i]).text().trim();
     console.log(txt)

     $.ajax({
     url:'/inline_type',
     type:'POST',
     async: false,
     data:{csrfmiddlewaretoken: window.CSRF_TOKEN, key:ids[i], base_id:$("thead").attr('id')},
     success:function(data)
         {
             console.log(data)
             console.log(data.Result[0])
             console.log(data.col_values)
             console.log('-------------------------------------------');
             if (data.Result[0].d_type.trim() == 'Date')
             {
                 inline_type = 'Date';
             }
             else if (data.Result[0].d_type.trim() == 'Time')
               {
                   inline_type = 'Time';

               }
             else if(data.Result[0].d_type.trim() == 'Calc')
             {
                 inline_type = 'Calc';
             }
             else if(data.Result[0].d_type.trim() == 'Text' || data.Result[0].d_type.trim() == 'Numeric'|| data.Result[0].d_type.trim() == 'Number'|| data.Result[0].d_type.trim() == 'String')
             {
               inline_type = 'text';
             }
             else if(data.Result[0].d_type.trim() == 'Image')
              {
                   inline_type = 'File';
              }
             else
             {
               inline_type = "select"
             }


             console.log("Inline Type : " + inline_type)

             if(inline_type == 'select')
             {
                 st = '<div class="col-md-12"><label>'+data.Result[0].c_name+'</label> <select class="details_edit form-control rr_edit select2">';
                 for(j=0; j<data.Relation.length; j++)
                 {
                     console.log(data.Relation.length)
                     st = st + '<option value="'+data.Relation[j]+'">'+data.Relation[j]+'</option>'
                 }
                 st = st + '</select></div>';
                 $('.copy_details').append(st);
                 $('.select2').select2();
             }
             else if(inline_type == 'Calc')
             {
                 console.log("Inline type is Calc")
                 var div = "<div class='col-md-12'>"
                  var c_div="</div>";
                 $('.copy_details').append(div + '<label>' + data.Result[0].c_name + '</label>' +c_div +div+ '<input type="'+inline_type+'" value="'+ data.col_values[0].c_v +'" class="inlinetxt  detailid_clc_edit form-control max" id="'+ids[i]+'" disabled maxlength="'+data.Result[0].d_size+'">' + c_div);
             }
             else if(inline_type == 'File')
             {
                 var div="<div class='col-md-12'>"
                 var c_div="</div>"
                 $('.copy_details').append(''+div+'<div class="row"><div class="col-md-3"><label>'+data.Result[0].c_name+'</label></div><div class="col-md-6" ><form method="POST" enctype="multipart/form-data" class="Inline_copy_row_fileUploadForm_images_data"><input type="file" style="width: 210px;" class="inlinetxt  form-control Inline_copy_row_detailid_add_new_image max" name="files" id="'+ids[i]+'"></form></div><div class="col-md-3"><img class="td_image" src="'+ data.col_values[0].c_v +'" alt="Image"></div></div>'+c_div+'');


             }

             else
             {
               var div="<div class='col-md-12'>"
                 var c_div="</div>"
                 $('.copy_details').append(''+div+'<label>'+data.Result[0].c_name+'</label>'+c_div +div+  '<input type="'+inline_type+'" value="'+data.col_values[0].c_v+'" class="inlinetxt details_edit form-control max" id="'+ids[i]+'" maxlength="'+data.Result[0].d_size+'">'+c_div+'');

             }
         }
     });
 }


});



$('.edit_modal').click((e)=>{
   var relation= $("th").map(function(){return $(this).attr('id');}).get();
   var values= $(".details_edit").map(function(){return $(this).val();}).get();
   var table_id = $("thead").attr('id');
   var mx = $(".table_body").attr('id')

   console.log("relation:"+relation)
   console.log("values:"+values)

   for(i=0;i<values.length;i++)
   {
     console.log(values[i])
     $.ajax({
         url:'/edit_modal',
         type:'POST',
         async: false,
         data:{csrfmiddlewaretoken: window.CSRF_TOKEN, key:ids[i], value:values[i], table_id:table_id}
     });
   }

   console.log("--- Uploading Images ---")
   var image_columns_id = $(".Inline_copy_row_detailid_add_new_image").map(function(){return $(this).attr('id');}).get();
   var form_data_image = $(".Inline_copy_row_fileUploadForm_images_data").map(function(){return $(this)[0];}).get();
   console.log("image_columns_id : - ");
   console.log(image_columns_id);
   console.log("form_data_image : -");
   console.log(form_data_image);
   for(i=0; i<image_columns_id.length; i++)
   {
     var form = form_data_image[i];
     var data = new FormData(form);
     data.append("id", image_columns_id[i]);
     data.append('base_id', $("thead").attr('id'));
     data.append("csrfmiddlewaretoken", window.CSRF_TOKEN);
     $.ajax({
         type:'POST',
         enctype: 'multipart/form-data',
         url:'/inline_update_image',
         async:false,
         data:data,
         processData: false,
         contentType: false,
         cache: false,
         timeout: 600000,
         success: function( data ){
             console.log(data);
         }
     });
   }
    setTimeout(function(){location.reload();}, 500);
});


$(".max").keyup(function(){
 var maxCount = $(this).attr('maxlength');
 console.log(maxCount)
 txtval=$(this).val().length
 console.log(txtval)
 if(txtval < maxCount){
$(".max").css('border','1px solid black');
$("#mesBox").css("display", "none");
}
else{
$(".max").css('border','1px solid red');
$("#mesBox").css("display", "block");
}
});
<!--Edit END-->

/**User account maintanance */
$('#user_del_company').on('change',function(){
 user=$('#user_del_company option:selected').val()
 $.ajax({
     url:'/fetch_user_role',
     type:'POST',
     data:{csrfmiddlewaretoken: window.CSRF_TOKEN,user:user},
     success:function(data){
         console.log(data.Result)
         $("#role_user").val(data.Result).prop('selected',true);
     //   if(data.Result == 'Employee' || data.Result == 'User' || data.Result == 'Other' || data.Result == 'Admin')
     //     {
     //      $("#role_user").val(data.Result).prop('selected',true);
     //     }
     //   else{
     //         $("#role_user").val('Other').prop('selected',true);
     //      }
     }

 })

})

$('.del_account_company').click(function(){
 user=$('#user_del_company option:selected').val()
 $.ajax({
     url:'/remove_user_account',
     type:'POST',
     data:{csrfmiddlewaretoken: window.CSRF_TOKEN,user:user},
     success:function(data){
         console.log(data)
         $('#account_user_delete').modal('hide')

     }

 });
//    setTimeout(function(){
//         location.reload();
//       }, 2000);
});
/**User account maintanance end*/

$('.detailid_add_new').bind('keyup', function() {
 if(allFilled()) $('.adddetails').removeAttr('disabled');
});

function allFilled() {
 var filled = true;
 $('.ffield').find('input').each(function() {
     if($(this).val() == '') filled = false;
 });
 return filled;
}








$("#col-property-selector").change(function(){
 var tbl = $(this).val();
 property(tbl);
});

$(document).on('click','#property-btn',function(){
 $(this).prop('disabled', true)
 $(this).val('Updating Changes...')
 var id = $(".input-cname").map(function(){return $(this).attr('id');}).get();
 var values = $(".input-cname").map(function(){return $(this).val();}).get();
 var tname = $(".input-tname").map(function(){return $(this).val();}).get();
 var d_type = $(".input-dtype").map(function(){return $(this).val();}).get();
 var null_v = $(".input-nullable").map(function(){return $(this).val();}).get();
 var col_siz = $(".input-size").map(function(){return $(this).val();}).get();
 var fk = $("#col-property-selector").val();
 console.log("IDS : " + id);
 console.log("COLUMNS : " + values);
 console.log("DATA TYPE : " + d_type);
 console.log("col size : " + col_siz);
 console.log("Null : " + null_v)
 console.log("Fk : " + fk);
 for(i=0; i<id.length; i++)
 {
     $.ajax({
         type:"POST",
         url: "/edit-column-property",
         data:{
             csrfmiddlewaretoken: window.CSRF_TOKEN,
             colname:values[i],
             tech_namee:tname[i],
             fk:fk,
             type_d:d_type[i],
             col_size:col_siz[i],
             v_null:null_v[i],
             id:id[i]
         },
         async: false,
         success: function( data )
         {
             console.log(data);
         }
     });
 }
 property(fk);
 new Noty({
    type: 'success',
    layout: 'topRight',
    theme: 'metroui',
    text: 'Changes updated.. ! 🤖',
    timeout: '4000',
    progressBar: true,
    closeWith: ['click'],
    killer: true,
 }).show();
});


function property(tbl)
{
 $.ajax({
     url:'/col-property-edit',
     type:'POST',
     data:{
         csrfmiddlewaretoken: window.CSRF_TOKEN,
         table: tbl
     },
     success:function(data){
         console.log(data);
         $(".column_property_content").empty();
         $(".column_property_content").append('<div class="row"><div class="col-md-3"><label class="">Business Name</label></div><div class="col-md-3"><label class="">Technical Name</label></div><div class="col-md-2"><label class="">Data Type</label></div><div class="col-md-2"><label class="">Size</label></div><div class="col-md-2"><label class="">Nullable</label></div></div>');
         for(i=0; i<data.Data.length; i++)
         {
             base = '<div class="row column_property_content_body" style="margin-top:1em;">';
             cname = '<div class="col-md-3"><input type="text" class="form-control input-cname" id="'+ data.Data[i]['pk'] +'" value="'+ data.Data[i]['c_name'] +'"></div>';
             tname = '<div class="col-md-3"><input type="text" class="form-control input-tname" value="'+ data.Data[i]['t_name'] +'"></div>';
             tmp_dtype = ''
             if(data.Data[i]['d_type'] != 'Number')
             {
                 tmp_dtype = tmp_dtype  + '<option value="Number">Number</option>'
             }

             if(data.Data[i]['d_type'] != 'String')
             {
                 tmp_dtype = tmp_dtype  + '<option value="String">String</option>'
             }
             if(data.Data[i]['d_type'] != 'Date')
             {
                 tmp_dtype = tmp_dtype  + '<option value="Date">Date</option>'
             }
             if(data.Data[i]['d_type'] != 'Time')
             {
                 tmp_dtype = tmp_dtype  + '<option value="Time">Time</option>'
             }
             if(data.Data[i]['d_type'] != 'Image')
             {
                 tmp_dtype = tmp_dtype  + '<option value="Image">Image</option>'
             }


             dtype = '<div class="col-md-2"><select class="form-control input-dtype"><option value="'+ data.Data[i]['d_type'] +'">'+data.Data[i]['d_type']+'</option>'+ tmp_dtype +'</select></div>';
             size = '';
             if((data.Data[i]['d_type'] == 'Date') || (data.Data[i]['d_type'] == 'Time') || (data.Data[i]['d_type'] == 'Image'))
             {
                 size = size + '<div class="col-md-2"><input type="text" class="form-control input-size" value="'+ data.Data[i]['d_size'] +'" disabled></div>';
             }
             else
             {
                 size = size + '<div class="col-md-2"><input type="text" class="form-control input-size" value="'+ data.Data[i]['d_size'] +'"></div>';
             }


             tmp_nullble = ''
             if(data.Data[i]['nul_type'] != 'NOTNULL')
             {
                 tmp_nullble = tmp_nullble  + '<option value="NOTNULL">NOT-NULL</option>'
             }

             if(data.Data[i]['nul_type'] != 'NULL')
             {
                 tmp_nullble = tmp_nullble  + '<option value="NULL">NULL</option>'
             }

             nullble = '<div class="col-md-2"><select class="form-control input-nullable" style="width: 108px;"><option value="'+ data.Data[i]['nul_type'] +'">'+ data.Data[i]['nul_type'] +'</option>'+ tmp_nullble +'</select></div>';
             base = base + cname + tname + dtype + size + nullble +  "</div>"
             $(".column_property_content").append(base);
         }
         $(".column_property_content").append('<div class="row"><div class="col-md-12" style="width:100%; text-align:right; margin-top:1em;"><button class="btn btn-danger" id="property-btn">Update</button></div></div>')

     }

 });
}

$('#disble_users_account').click(function(){
 // alert('jjjjj')
user_id=$('#user_disable_account option:selected').val()
disable_period =$('.disable_for:checked').val();
console.log(disable_period)
console.log(user_id)
$.ajax({
 url:'/disable_user_account',
 type:'POST',
 data:{csrfmiddlewaretoken: window.CSRF_TOKEN,user:user_id,disable_period:disable_period,},
 success:function(data){
     console.log(data)
     $('#user_account_disable').modal('hide')

 }

});
//  setTimeout(function(){
//     location.reload();
//   }, 2000);
});

$('#user_name_edit').click(function(){
 sel_user=$('#user_name_edit option:selected').val()
 $.ajax({
     url:'/fetch_update_user',
     type:'POST',
     data:{csrfmiddlewaretoken: window.CSRF_TOKEN,sel_user:sel_user},
     success:function(data){
         console.log(data.user_data)
         $('#role_user_up').val(data.user_data[0]['role']).prop('selected',true);
         $('#up_name').val(data.user_data[0]['name'])
         $('#up_email').val(data.user_data[0]['email'])
         $('#up_phone').val(data.user_data[0]['phone'])


     }

  });

});

$('.update_user_account').click(function(){
 sel_user=$('#user_name_edit option:selected').val()
 role= $('#role_user_up option:selected').val()
 name= $('#up_name').val()
 email=$('#up_email').val()
 phone=$('#up_phone').val()
 console.log('name'+name)
 console.log(sel_user)
 console.log(role)

 $.ajax({
     url:'/update_user_account',
     type:'POST',
     data:{csrfmiddlewaretoken: window.CSRF_TOKEN,role:role,name:name,email:email,phone:phone,sel_user:sel_user},
     success:function(data){
         console.log(data)
         $('#edit_user_account').modal('hide')


     }

  });


});


// $('#searchfor').keyup(function(){
  
//          var page = $('#all_text');
//          var pageText = page.text().replace("<span>","").replace("</span>");
//          var searchedText = $('#searchfor').val();
//          var theRegEx = new RegExp("("+searchedText+")", "igm");    
//          var newHtml = pageText.replace(theRegEx ,"<span>$1</span>");
//          page.html(newHtml);
//     });


$(function() {
    $("#searchfor").on("input.highlight", function() {
      // Determine specified search term
      var searchTerm = $(this).val();
      // Highlight search term inside a specific context
      $("#all_text").unmark().mark(searchTerm);
    }).trigger("input.highlight").focus();
  });


