/////////////column view/////////////


$('#tblchos').on('change',function(e){

    console.log($("#tblchos option:selected").val());
    base_id=$("#tblchos option:selected").val();


    $.ajax({
        url:'/editcol',
        type:'POST',
        data:{csrfmiddlewaretoken: window.CSRF_TOKEN,base_id:base_id},

        success:function(data) {
            console.log(data.Result)
            $(".tbl_coledit").empty()
             for(i=0;i<data.Result.length;i++)
             {
                 markup = "<tr class='tr_id' id='"+data.Result[i].pk +"' >'<td>"+data.Result[i].c_name+"</td>''<td>"+data.Result[i].t_name+"</td>''<td>"+data.Result[i].d_type+"</td>''<td>"+data.Result[i].d_size+"</td>''<td>"+data.Result[i].nul_type+"</td>'</tr>"

                 $('.tbl_coledit').append(markup)
             }





        },

    });



    });

////////////////////////////////////////////////////validation in add account //////////////////////

      $(".createac_for_emp").click(function(){
          fnmm=$(".fnmm").val()
          email=$(".emll").val()
          mob=$(".mobb").val()
        //   prof=$(".proo").val()
          prof=$('#profile_reg').find(":selected").text();
          
          passw=$(".passs").val()
          cpassw=$(".cpasss").val()
          console.log(fnmm)
          console.log(prof)
      if(fnmm == '')
        {
            //  alert("Name Field is missing");
            $('#fnm').css('visibility', 'visible');
            return false;
        }

        else{

            $('#fnm').css('visibility', 'hidden');

        }


        if(email == '')
        {
            //  alert("Name Field is missing");
            $('#eml').css('visibility', 'visible');
            return false;
        }

        else{

            $('#eml').css('visibility', 'hidden');

        }


        if(mob == '')
        {
            //  alert("Name Field is missing");
            $('#mob').css('visibility', 'visible');
            return false;
        }

        else{

            $('#mob').css('visibility', 'hidden');

        }

        if(prof == 'Choose profile..')
        {
            //  alert("Name Field is missing");
            $('#pro').css('visibility', 'visible');
            return false;
        }

        else{
            if(prof != 'Choose profile..')
            {

            $('#pro').css('visibility', 'hidden');
            }

        }

        if(passw == '')
        {
            //  alert("Name Field is missing");
            $('#pass').css('visibility', 'visible');
            return false;
        }

        else{

            $('#pass').css('visibility', 'hidden');

        }

        if(cpassw == '')
        {
            //  alert("Name Field is missing");
            $('#cpass').css('visibility', 'visible');
            return false;
        }

        else{

            $('#cpass').css('visibility', 'hidden');

        }


      });

      $(".fnmm").keyup(function(){
        $('#fnm').css('visibility', 'hidden');


      });
      $(".emll").keyup(function(){
        $('#eml').css('visibility', 'hidden');


      });
      $(".mobb").keyup(function(){
        $('#mob').css('visibility', 'hidden');


      });
      $(".proo").keyup(function(){
        $('#pro').css('visibility', 'hidden');


      });
      $(".passs").keyup(function(){
        $('#pass').css('visibility', 'hidden');


      });
      $(".cpasss").keyup(function(){
        $('#cpass').css('visibility', 'hidden');


      });

$(".ref").click(function()
      {

                location.reload(true);


        });



        // $(".search").keyup(function() {
        //     $(".search").on("input.highlight", function() {
        //       // Determine specified search term
        //       var searchTerm = $(this).val();
        //       // Highlight search term inside a specific context
        //       $(".context").unmark().mark(searchTerm);
        //     }).trigger("input.highlight").focus();
        //   });
    

        