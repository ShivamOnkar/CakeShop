// src/pages/Admin/Orders.jsx
import { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Select,
  Input,
  Modal,
  Descriptions,
  Card,
  Statistic,
  Row,
  Col,
  message,
  Spin,
} from "antd";
import {
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../components/Layouts/AdminLayout";

const { Option } = Select;
const { Search } = Input;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orderStatuses = [
    { value: "pending", label: "Pending", color: "orange" },
    { value: "confirmed", label: "Confirmed", color: "blue" },
    { value: "preparing", label: "Preparing", color: "purple" },
    { value: "ready", label: "Ready", color: "cyan" },
    { value: "delivered", label: "Delivered", color: "green" },
    { value: "cancelled", label: "Cancelled", color: "red" },
  ];

  // ✅ Fetch Orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Admin token not found. Please login again.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch orders");

      const ordersData = data.orders || data || [];
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error(error.message || "Unable to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Update Order Status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update order");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      message.success("Order status updated successfully");
    } catch (error) {
      console.error(error);
      message.error(error.message || "Error updating order status");
    }
  };

  // ✅ Search
  const handleSearch = (value) => {
    const term = value.toLowerCase();
    if (!term) {
      setFilteredOrders(orders);
      return;
    }
    const filtered = orders.filter(
      (o) =>
        o.user?.name?.toLowerCase().includes(term) ||
        o.user?.email?.toLowerCase().includes(term) ||
        o._id?.toLowerCase().includes(term)
    );
    setFilteredOrders(filtered);
  };

  // ✅ Order Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;

  const orderStats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: <ShoppingCartOutlined />,
      color: "#1890ff",
    },
    {
      title: "Pending Orders",
      value: pendingCount,
      icon: <ShoppingCartOutlined />,
      color: "#faad14",
    },
    {
      title: "Delivered Orders",
      value: deliveredCount,
      icon: <ShoppingCartOutlined />,
      color: "#52c41a",
    },
    {
      title: "Total Revenue",
      value: totalRevenue,
      icon: <DollarOutlined />,
      color: "#722ed1",
      prefix: "₹",
    },
  ];

  // ✅ Table Columns
  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      width: 150,
    },
    {
      title: "Customer",
      render: (record) => (
        <>
          <div className="font-medium">{record.user?.name || "Guest"}</div>
          <div className="text-xs text-gray-500">{record.user?.email}</div>
        </>
      ),
    },
    {
      title: "Phone",
      render: (record) => record.shippingAddress?.phone || "-",
    },
    {
      title: "City",
      render: (record) => record.shippingAddress?.city || "-",
    },
    {
      title: "Amount",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (amount) => `₹${amount}`,
      align: "right",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const s = orderStatuses.find((st) => st.value === status);
        return <Tag color={s?.color}>{s?.label || status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Select
            value={record.status}
            style={{ width: 130 }}
            onChange={(value) => updateOrderStatus(record._id, value)}
          >
            {orderStatuses.map((s) => (
              <Option key={s.value} value={s.value}>
                {s.label}
              </Option>
            ))}
          </Select>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setSelectedOrder(record);
              setIsModalVisible(true);
            }}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: 100 }}>
          <Spin size="large" />
        </div>
      ) : (
        <div>
          {/* ✅ Statistics */}
          <Row gutter={16} style={{ marginBottom: "24px" }}>
            {orderStats.map((stat, index) => (
              <Col span={6} key={index}>
                <Card>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={stat.prefix}
                    valueStyle={{ color: stat.color }}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* ✅ Header + Search */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
              Order Management
            </h1>
            <Space>
              <Search
                placeholder="Search by name, email or ID..."
                onSearch={handleSearch}
                style={{ width: 280 }}
                enterButton={<SearchOutlined />}
              />
              <Button icon={<FilterOutlined />}>Filters</Button>
            </Space>
          </div>

          {/* ✅ Orders Table */}
          <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey="_id"
            pagination={{ pageSize: 8 }}
            scroll={{ x: 1000 }}
          />

          {/* ✅ Order Details Modal */}
          <Modal
            title={`Order Details - ${selectedOrder?._id}`}
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={[
              <Button key="close" onClick={() => setIsModalVisible(false)}>
                Close
              </Button>,
            ]}
            width={700}
          >
            {selectedOrder && (
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Customer Name">
                  {selectedOrder.user?.name}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedOrder.user?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {selectedOrder.shippingAddress?.phone}
                </Descriptions.Item>
                <Descriptions.Item label="City">
                  {selectedOrder.shippingAddress?.city}
                </Descriptions.Item>
                <Descriptions.Item label="Total Amount">
                  ₹{selectedOrder.totalPrice}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag
                    color={
                      orderStatuses.find(
                        (s) => s.value === selectedOrder.status
                      )?.color
                    }
                  >
                    {
                      orderStatuses.find(
                        (s) => s.value === selectedOrder.status
                      )?.label
                    }
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Payment">
                  {selectedOrder.paymentMethod?.toUpperCase() || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Address" span={2}>
                  {selectedOrder.shippingAddress?.address || "No address provided"}
                </Descriptions.Item>
                <Descriptions.Item label="Products" span={2}>
                  <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    {selectedOrder.orderItems?.map((p, i) => (
                      <li key={i}>
                        {p.quantity}x {p.name} - ₹{p.price}
                      </li>
                    ))}
                  </ul>
                </Descriptions.Item>
              </Descriptions>
            )}
          </Modal>
        </div>
      )}
    </AdminLayout>
  );
};

export default Orders;
