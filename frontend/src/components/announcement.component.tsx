import React, { Component, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import AnnouncementDataService from "../services/announcement.service";
import ISannouncementData from "../types/announcement.type";

import AdminControl from '../services/admin-control';

type Props = { id: string; navigation: any }

type State = {
  currentAnnouncement: ISannouncementData;
  message: string;
  adminAccess: boolean
}


function withParams(Component: any) {
  return (props: any) => {
    const navigation = useNavigate();
    const params = useParams();
    return <Component {...props} id={params} navigation={navigation} />;
  }
}

class Announcement extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.onChangeTitle= this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.getAnnouncement = this.getAnnouncement.bind(this);
    this.updateAnnouncement = this.updateAnnouncement.bind(this);
    this.deleteAnnouncement = this.deleteAnnouncement.bind(this);

    this.state = {
        currentAnnouncement: {
        id: null,
        title: "",
        description: "",
      },
      message: "",
      adminAccess: false
    };
  }

  async componentDidMount() {// may cause a problem
    const adminAccess = await AdminControl();
    this.setState({ adminAccess });
    if (adminAccess) {
      let id: string;

      id = this.props.id;
      console.log(id);
      if (id) {
        this.getAnnouncement(id);
      }
    }
  }

  onChangeTitle(e: ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;

    this.setState(function (prevState) {
      return {
        currentAnnouncement: {
          ...prevState.currentAnnouncement,
          title: title,
        },
      };
    });
  }

  onChangeDescription(e: ChangeEvent<HTMLInputElement>) {
    const description = e.target.value;

    this.setState((prevState) => ({
        currentAnnouncement: {
        ...prevState.currentAnnouncement,
        description: description,
      },
    }));
  }

  getAnnouncement(idProp: any) {
    AnnouncementDataService.get(idProp.id)
      .then((response: any) => {
        this.setState({
            currentAnnouncement: response.data,
        });
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }
  updateAnnouncement() {
    AnnouncementDataService.update(
      this.state.currentAnnouncement,
      this.state.currentAnnouncement.id
    )
      .then((response: any) => {
        console.log(response.data);
        this.setState({
          message: "The Announcement was updated successfully!",
        });
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }
  deleteAnnouncement() {
    AnnouncementDataService.delete(this.state.currentAnnouncement.id)
      .then((response: any) => {
        console.log(response.data);
        this.props.navigation("/announcements");
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }
  render() {
    if (!this.state.adminAccess) {
      return (
        <div className="container">
          <header className="jumbotron">
            <h3>{"Require Admin Role!"}</h3>
          </header>
        </div>
      );
    }
    else {
      const { currentAnnouncement } = this.state;

      return (
        <div>
          {currentAnnouncement ? (
            <div className="edit-form">
              <h3><strong>Announcement</strong></h3>
              <form>
                <div className="form-group">
                  <h4>
                    <label htmlFor="name">Title</label>
                  </h4>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="name"
                    value={currentAnnouncement.title}
                    onChange={this.onChangeTitle}
                  />
                </div>
                <div className="form-group">
                  <h4>
                    <label htmlFor="description">Description</label>
                  </h4>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="description"
                    value={currentAnnouncement.description}
                    onChange={this.onChangeDescription}
                  />
                </div>
              </form>

              <h3>
                <button
                  className="badge badge-danger mr-2"
                  onClick={this.deleteAnnouncement}
                >
                  Delete
                </button>
              </h3>

              <h3>
                <button
                  type="submit"
                  className="badge badge-success"
                  onClick={this.updateAnnouncement}
                >
                  Update
                </button>
                <p>{this.state.message}</p>
              </h3>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on an Announcement...</p>
            </div>
          )}
        </div>
      );
    }

  }
}

export default withParams(Announcement);