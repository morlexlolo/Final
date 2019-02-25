<template>
  <div class="container">
    <div class="row mt-3">
      <div class="col-md-12">
<div class="col-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">User Table</h3>

                <div class="card-tools">
                    <button type="submit" class="btn btn-primary" @click="userModel"><i class="fas fa-lg fa-fw fa-user-plus"></i>Add User</button>
                </div>
              </div>
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <tbody><tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>photo</th>
                    <th>Created At</th>
                    <th>Delete</th>
                    <th>Edit</th>
                  </tr>

                  <tr v-for="user in users" :key="user.id">
                    <td>{{ user.id }}</td>
                    <td>{{ user.name | capitalize}}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.role | capitalize }}</td>
                    <td>profile.png</td>
                    <td>{{ user.created_at |myDate }}</td>
                    <td> <a href="#" style="color:red" @click="deleteUser(user.id)"><i class="fas fa fa-trash"></i></a></td>
                    <td><a href="#"  style="color:green" @click="editModel(user)"><i class="fas fa fa-user-plus"></i></a></td>
                  </tr>


                </tbody></table>
              </div>
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
          </div>
      </div>
    </div>
    <!-- Modal -->
                    <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" v-show="!editmode" id="exampleModalLongTitle">Add User</h5>
                            <h5 class="modal-title" v-show="editmode" id="exampleModalLongTitle">Update User</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <form @submit.prevent="editmode  ? updateUser() : createUser()">
                        <div class="modal-body">

                           <div class="form-group">

                                    <input v-model="form.name" type="text" name="name"
                                    placeholder="Please enter your name"
                                        class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                                    <has-error :form="form" field="name"></has-error>
                            </div>
                            <div class="form-group">

                                    <input v-model="form.email" type="email" name="email"
                                    placeholder="Please enter your email"
                                    class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                                    <has-error :form="form" field="email"></has-error>
                            </div>

                             <div class="form-group">
                                <select name="role" v-model="form.role" id="role" class="form-control" :class="{ 'is-invalid': form.errors.has('role') }">
                                    <option value="">Select User Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="user"> User</option>
                                    <option value="author">Author</option>
                                </select>
                                <has-error :form="form" field="role"></has-error>
                              </div>

                              <div class="form-group">

                                    <input v-model="form.password" type="text" name="password"
                                    placeholder="Please enter your password"
                                        class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                                     <has-error :form="form" field="password"></has-error>
                                 </div>


                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                            <button v-show="editmode" type="sumit" class="btn btn-success">Update</button>
                             <button v-show="!editmode" type="sumit" class="btn btn-primary">Create</button>
                        </div>
                        </form>
                        </div>
                    </div>
                    </div>
  </div>
</template>

<script>

// taoster swal
const Toast = swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

// Importing v-form

import { Form, HasError, AlertError } from 'vform';
window.form = Form ;
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)


export default {
    // user object

    data(){

        return{
            editmode:false,
             users:{},
                form: new Form({
                    id:'',
                    name:'',
                    email:'',
                    password:'',
                    role:'',
                    photo:'',
                })
        }
    },
    methods:{
        updateUser(id){
             this.$Progress.start()

             this.form.put('api/user/'+this.form.id).then(()=>{
                  swal.fire(
                            'Update!',
                            'Information has been updated.',
                            'success'
                            )
                            Fire.$emit('afterCreate')
                             this.$Progress.finish()
                          $('#addNew').modal('hide');
             }).catch(()=>{
                    this.$Progress.fail()
             })

       },
        userModel(){
                this.editmode=false;
                this.form.reset();
                $('#addNew').modal('show');

        },
        editModel(user){
                this.editmode=true;
                this.form.reset();
                $('#addNew').modal('show');
                this.form.fill(user);
        },
        deleteUser(id){

            swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                // send request to the serve
                        if(result.value){
                        this.form.delete('api/user/'+ id).then(()=>{
                            swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                            )
                             Fire.$emit('afterCreate');

                }).catch(()=>{
                    swal("Failed","There was something wrong.","Warning");
                })
                        }

})
        },
        loadUsers(){
            // get user data and store in users object
            axios.get("api/user").then(({data})=>(this.users = data.data));

        },

        createUser(){

            this.$Progress.start()
            // posting reguest to the database
            this.form.post('/api/user').then(() =>{
                Fire.$emit('afterCreate');
                 $('#addNew').modal('hide');
                Toast.fire({
                type: 'success',
                title: 'User Created successfully'
                })
            this.$Progress.fail();
            }).catch(()=>{

            })

        }

    },
  created() {
    this.loadUsers();
    // update an event in the database
    Fire.$on('afterCreate',() =>{
        this.loadUsers();
    })
//     setInterval(()=>this.loadUsers(),3000);
   }
};
</script>
