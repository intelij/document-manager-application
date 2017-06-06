import React from 'react';
import jwtDecode from 'jwt-decode';
import { Modal, Button, Row, Input } from 'react-materialize';
import { connect } from 'react-redux';
import * as UserAction from '../../actions/UserAction';
import Prompt from '../common/Prompt';
import { searchUsers } from '../../actions/SearchUserAction';

const token = localStorage.getItem('dms-user');
const userRoleId = token ? jwtDecode(token).roleId : null;

class UserListRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.user.id,
      firstName: this.props.user.firstName,
      lastName: this.props.user.lastName,
      userName: this.props.user.userName,
      email: this.props.user.email,
      roleId: this.props.user.roleId
    };

    this.onChange = this.onChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }
  onChange(e) {
    return this.setState({ [e.target.name]: e.target.value });
  }
  onSearch(e) {
    const queryString = e.target.value;
    return this.props.searchUsers(queryString);
  }
  onSubmit(e) { 
    e.preventDefault();
    const { updateUser } = this.props;
    const { deleteUser } = this.props;
    const userId = this.props.user.id;
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const userName = e.target.userName.value;
    const email = e.target.email.value;
    const roleId = e.target.roleId.value;
    const userDetails = { firstName, lastName, userName, email, roleId };
    console.log(userId)
    updateUser(userDetails, userId);
    deleteUser(userDetails);
  }

  deleteUser(id) {
    this.props.deleteUser(id);
  }

  render() {
    const user = this.props.user;

    return (
      <tr>
        <td>{user.firstName}</td>
        <td>{user.lastName}</td>
        <td>{user.userName}</td>
        <td>{user.email}</td>
        <td>{user.roleId === 1 ? 'Admin' : user.roleId === 2 ?
            'regular' : 'Guest'}</td>
        <Modal
          header="Edit User"
          trigger={
            <td><Button
              modal="close" waves="light"
              className="btn-floating btn-large teal darken-2"
            >
              <i className="large material-icons">mode_edit</i>
            </Button></td>
          }
        >
          <form
            className="col s12" method="post" onSubmit={e =>
                this.onSubmit(e)}
          >


            <Row>
              <Input
                s={6} label="firstName" name="firstName"
                value={this.state.firstName} onChange={this.onChange}
              />
              <Input
                s={6} label="lastName" name="lastName"
                value={this.state.lastName} onChange={this.onChange}
              />
            </Row>

            <Row>
              <Input
                s={6} label="userName" name="userName"
                value={this.state.userName} onChange={this.onChange}
              />
              <Input
                s={6} label="email" name="email"
                value={this.state.email}
                onChange={this.onChange}
              />
            </Row>

            {userRoleId === 1 ? <Row>
              <Input
                s={6} label="roleId" name="roleId"
                value={this.state.roleId} onChange={e =>
                    this.onChange(e)}
              />
            </Row> : ''}

            <Button
              className="teal darken-2" waves="light"
              type="submit"
            >UPDATE</Button>
          </form>
        </Modal>
        <Prompt
          trigger={
            <Button
              waves="light"
              className="btn-floating btn-large red darken-2 right"
            >
              <i className="large material-icons">delete</i>
            </Button>
                    }
          onClickFunction={
                (e) => { this.deleteUser(user.id); }
              }
        />
      </tr>
    );
  }
           }
UserListRow.propTypes = {
  user: React.PropTypes.object.isRequired,
  deleteUser: React.PropTypes.func.isRequired,
  searchUsers: React.PropTypes.func.isRequired,
  updateUser: React.PropTypes.func.isRequired,
};
const mapDispatchToProps = dispatch => ({
  updateUser: (userDetails, userId) => dispatch(UserAction.updateUser(userDetails, userId)),
  deleteUser: id => dispatch(UserAction.deleteUser(id)),
  searchUsers: queryString => dispatch(searchUsers(queryString))
});

const mapStateToProps = state => ({
  userDetails: state.user
});


export default connect(mapStateToProps, mapDispatchToProps)(UserListRow);
