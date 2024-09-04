import {
    Card,
    Row,
    Col,
    CardTitle,
    CardBody,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    FormText,
} from "reactstrap";
import { Link } from "react-router-dom";
const Timetable = () => {
    return (
        <Row>
            <Col>
                <Card>
                    <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                        <i className="bi bi-card-text me-2"> </i>
                        Thêm thời khoá biểu mới
                    </CardTitle>
                    <CardBody className="pt-0">
                        <Form>
                            <Row className="mt-3">
                                <Col>
                                    <FormGroup>
                                        <Label for="exampleEmail">Chi Nhánh</Label>
                                        <Input id="exampleSelect" name="select" type="select" placeholder="Chọn chi nhánh">

                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="exampleEmail">Trainer</Label>
                                        <Input id="exampleSelect" name="select" type="select" placeholder="Chọn chi nhánh">

                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="exampleEmail">Gói</Label>
                                        <Input id="exampleSelect" name="select" type="select" placeholder="Chọn chi nhánh">

                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    </CardBody>
                </Card>
                <Card>
                    <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                        Lịch
                    </CardTitle>
                    <CardBody className="pt-0">
                        <Form>
                            <Row className="mt-3">
                                <Col>
                                    <FormGroup>
                                        <Label for="exampleEmail">Thời gian bắt đầu</Label>
                                        <Input
                                            id="exampleEmail"
                                            name="email"
                                            placeholder="Thời gian bắt đầu"
                                            type="email"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="exampleEmail">Thời gian kết thúc</Label>
                                        <Input
                                            id="exampleEmail"
                                            name="email"
                                            placeholder="Thời gian kết thúc"
                                            type="email"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="exampleEmail">Ngày</Label>
                                        <Input
                                            id="exampleEmail"
                                            name="email"
                                            placeholder="Ngày"
                                            type="email"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <div className="btn-form">
                                <Link to={'/admin/timetables'}>
                                    <Button className="mt-2 btn-secondary me-2">Huỷ</Button>
                                </Link>

                                <Button color="primary" className="mt-2 btn">Thêm mới</Button>
                            </div>

                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default Timetable;
