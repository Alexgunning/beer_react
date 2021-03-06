import React, { Component } from 'react'
import { Form, Input, Button, Rate, Modal, Upload, Icon } from 'antd';
import { Route, Redirect } from 'react-router-dom'
import moment from 'moment'

const FormItem = Form.Item;
const confirm = Modal.confirm;
const { TextArea } = Input;

const formPadStyle = {
  padding: "25px"
  // backgroundColor: "#D3D3D3"
};
const dragBoxStyle = {
  height: "180px",
  lineHeight: "1.5"
}

const formStyle = {
  background: "#fbfbfb",
  border: "1px solid #d9d9d9",
  borderRadius: "6px",
  width: "50%",
  margin: "0 auto", padding: "25px"
  // backgroundColor: "#D3D3D3"
};

class BeerForm extends Component {
  state = {
    confirmDirty: false,
    attemptToLeave: false,
    updated: false
  };

  deleteBeer(history, _id, handleDelete) {
    handleDelete(_id);
    history.push('/');
  }

  showDeleteConfirm(history, _id, callDeleteFunc, handleDelete) {
    confirm({
      title: 'Delete this beer?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        callDeleteFunc(history, _id, handleDelete);
      },
      onCancel() {
      },
    });
  }

  showCancelConfirm(history) {
    confirm({
      title: 'Lose unsaved changes?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        history.push('/');
      },
      onCancel() {
      },
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // LOOK INTO HOW TO HANDLE THIS STRING STUFF
        // if (values.abv)
        //   values.abv = values.abv.trim();
        values._id = this.props.initialValues._id;
        this.setState({updated : true})
        this.props.handleSubmit(values);
      }
    });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const buttonName = this.props.buttonName;

    const formItemLayout = {
      span: 10,
      offset: 3,
    }

    const buttonRow = {
      display: "flex",
      justifyContent: "center",
    }

    const buttonItem = {
      margin: "20px"
    }

    let initialValues = this.props.initialValues;
    if (this.state.updated)
      return (
        <Redirect
          to={{
            pathname: "/"
          }}
        />

      )

    else
      return (
        <div style={formPadStyle}>
          <div style={formStyle}>
            <img width={67} height={180} alt="logo" src={`http://localhost:5000/uploads/${initialValues._id}?query=${new moment().format()}`} />
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                label="Beer"
              >
                {getFieldDecorator('name', {
                  initialValue: initialValues.name
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="Brewer"
              >
                {getFieldDecorator('brewer', {
                  initialValue: initialValues.brewer
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="ABV"
              >
                {getFieldDecorator('abv', {
                  initialValue: initialValues.abv
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="Description"
              >
                {getFieldDecorator('description', {
                  initialValue: initialValues.description
                })(
                  <TextArea />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="Rating"
              >
                {getFieldDecorator('rating', {
                  initialValue: initialValues.rating
                })(
                  <Rate allowHalf  />
                )}
              </FormItem>
              <PicturesWall _id={initialValues._id}/>
              <Route render={({history}) => (
                <div style={buttonRow} id="button-row">
                  <FormItem>
                    <Button style={buttonItem} type="primary" htmlType="submit">{buttonName}</Button>
                  </FormItem>
                  <FormItem>
                    <Button style={buttonItem} type="danger" htmlType="button" onClick={() => { this.props.form.isFieldsTouched() ? this.showCancelConfirm(history) : history.push('/') } } >Cancel</Button>
                  </FormItem>
                  <FormItem>
                    <DeleteButton  isNew={this.props.isNew} style={buttonItem} _id={initialValues._id} isNew={this.props.isNew} type="danger" htmlType="button" history={history} deleteConfirm={this.showDeleteConfirm} deleteBeerFunc={this.deleteBeer.bind(this)} handeDelete={this.props.handleDelete} />
                </FormItem>
              </div>
              )} />
          </Form>
        </div>
      </div>
      );
  }
}

class DeleteButton extends React.Component {
  render() {
    if (this.props.isNew) {
      return (<div></div>)
    }
    else
      return(
        <Button style={this.props.style} type="danger" htmlType="button" onClick={() => {
          this.props.deleteConfirm(this.props.history, this.props._id, this.props.deleteBeerFunc, this.props.handeDelete); }}>
         Delete Beer</Button>
      )
  }
}

class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => this.setState({ fileList })


  headers = { Authorization: `Bearer ${localStorage.getItem('access_token')}`, Id: this.props._id }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload Beer Image</div>
      </div>
    );
    console.log(this.props._id);
    return (
      <div className="clearfix">
        <Upload
          headers={this.headers}
          action="http://localhost:5000/upload"
          accept='.png, .jpg'
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}


export default Form.create()(BeerForm);
