import React from 'react';
import cx from 'classnames';
import { Row, Col, Carousel, Avatar } from 'antd';
import Layout from '../../components/Layout';
import Requests from '../../components/Requests';
import Arrow from '../../components/Arrow';
import OrganizationProfileForm from '../../components/OrganizationProfileForm';
import { maskPhone } from '../../utils/mask';
import colors from '../../utils/styles/colors';
import api from '../../utils/api';
import { getUser } from '../../utils/auth';
import styles from './styles.module.scss';
import Loading from '../../components/Loading/Loading';

const carouselSettings = {
  slidesToShow: 1,
};

const mediaQuery = window.matchMedia('(min-width: 700px)');

class OrganizationProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrowSize: mediaQuery.matches ? 60 : 32,
      isOrganization: false,
      editProfileVisible: false,
      saveEnabled: false,
    };

    mediaQuery.addListener(this.widthChange.bind(this));
  }

  componentWillMount() {
    this.beforeFetch();
  }

  componentWillUnmount() {
    mediaQuery.removeListener(this.widthChange);
  }

  widthChange() {
    this.setState({
      arrowSize: mediaQuery.matches ? 60 : 32,
    });
  }

  beforeFetch() {
    this.setState({ loading: true });
    setTimeout(() => this.fetchData(), 2000);
  }

  activeStatusFilter(request) {
    return request.status === 'ACTIVE';
  }

  inactiveStatusFilter(request) {
    return request.status === 'INACTIVE';
  }

  filterRequestsByStatus(requests, active) {
    if (active) {
      return requests.filter(this.activeStatusFilter);
    }
    return requests.filter(this.inactiveStatusFilter);
  }

  fetchData() {
    const user = getUser();
    api.get('organization/1').then(
      (response) => {
        this.setState({
          organization: response.data,
          activeRequests: this.filterRequestsByStatus(response.data.needs, true),
          inactiveRequests: this.filterRequestsByStatus(response.data.needs, false),
          isOrganization: user ? user.id === response.data.id : false,
          loading: false,
        });
      },
    );
  }

  renderImages(images) {
    return (
      images.map(image => <img key={image.id} src={image.url} alt={image.name} />)
    );
  }

  renderOrganizationInfo() {
    const { organization } = this.state;
    const { address } = organization;

    return (
      <div>
        {this.state.isOrganization &&
          <div className={styles.buttonWrapper}>
            <button
              className={styles.editButton}
              onClick={() => this.setState({ editProfileVisible: true })}
            >
              EDITAR
            </button>
            <OrganizationProfileForm
              visible={this.state.editProfileVisible}
              onCancel={() => this.setState({ editProfileVisible: false, saveEnabled: false })}
              onSave={() => this.fetchData()}
              saveEnabled={this.state.saveEnabled}
              enableSave={enable => this.setState({ saveEnabled: enable })}
              organization={organization}
            />
          </div>
        }
        <Avatar
          src={organization.logo}
          size={'large'}
          style={{ marginTop: 20 }}
        />
        <h1 className={styles.organizationName}>
          <span>{organization.name}</span>
        </h1>
        <Col
          sm={{ span: 18, offset: 3 }}
          xs={{ span: 24, offset: 0 }}
        >
          <div className={cx(styles.border, styles.aboutBorder)}>
            <h1>Sobre</h1>
            <p>{organization.about}</p>
          </div>
          <div className={cx(styles.border, styles.phoneBorder)}>
            <h1>Telefone</h1>
            <a>{maskPhone(organization.phone)}</a>
          </div>
          <div className={cx(styles.border, styles.addressBorder)}>
            <h1>Endereço</h1>
            <a>{`${address.street} ${address.number}, ${address.complement}, Bairro ${address.neighborhood}, ${address.city} - ${address.state} `}</a>
          </div>
          <div className={cx(styles.border, styles.imagesBorder)}>
            <h1>Imagens da Organização</h1>
          </div>
          <div className={styles.arrowWrapper}>
            <Arrow
              size={this.state.arrowSize}
              color={colors.teal_400}
              onClick={() => this.carousel.prev()}
              left
              over
            />
            <div className={styles.carouselWrapper}>
              <Carousel
                ref={(ref) => { this.carousel = ref; }}
                infinite={false}
                {...carouselSettings}
              >
                {this.renderImages(organization.images)}
              </Carousel>
            </div>
            <Arrow
              size={this.state.arrowSize}
              color={colors.teal_400}
              onClick={() => this.carousel.next()}
              over
            />
          </div>
        </Col>
      </div>
    );
  }

  render() {
    return (
      <Layout>
        <Row>
          <Col
            xl={{ span: 20, offset: 2 }}
            xs={{ span: 22, offset: 1 }}
          >
            <div className={styles.profileWrapper}>
              <h2 className={styles.containerTitle}>
                <span>PERFIL DA ORGANIZAÇÃO</span>
              </h2>
              {this.state.loading ? <Loading /> : this.renderOrganizationInfo()}
            </div>
          </Col>
        </Row>
        <Requests
          isOrganization={this.state.isOrganization}
          loading={this.state.loading}
          activeRequests={this.state.loading ? null : this.state.activeRequests}
          inactiveRequests={this.state.loading ? null : this.state.inactiveRequests}
          onSave={() => this.fetchData()}
        />
      </Layout>
    );
  }
}

export default OrganizationProfile;
