import React from "react";
import { Container, Typography, Card, CardContent, Box, Avatar, Stack, Button } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

export default function ContactUs() {
  return (
    <section className="container"  style={{ marginTop: 6, marginBottom: 6 }}>
      <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="subtitle1" align="center"  gutterBottom>
        Have questions or need help? Reach out to us!
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} justifyContent="center" sx={{ mt: 4 }}>
        <Card sx={{ flex: 1, minWidth: 250, bgcolor: "#1f2433", color: "#f5f7ff", borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar sx={{ bgcolor: "#2866f2" }}>
                <EmailIcon />
              </Avatar>
              <Typography variant="h6" fontWeight={600}>
                Email
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
              support@onlinepoliceassistance.com
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, bgcolor: "#2866f2" }}
              href="mailto:support@onlinepoliceassistance.com"
            >
              Send Email
            </Button>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 250, bgcolor: "#1f2433", color: "#f5f7ff", borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar sx={{ bgcolor: "#2866f2" }}>
                <PhoneIcon />
              </Avatar>
              <Typography variant="h6" fontWeight={600}>
                Phone
              </Typography>
            </Box>
            <Typography variant="body1">+91-12345-67890</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, bgcolor: "#2866f2" }}
              href="tel:+911234567890"
            >
              Call Now
            </Button>
          </CardContent>
        </Card>

         <Card sx={{ flex: 1, minWidth: 250, bgcolor: "#1f2433", color: "#f5f7ff", borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar sx={{ bgcolor: "#2866f2" }}>
                <PhoneIcon />
              </Avatar>
              <Typography variant="h6" fontWeight={600}>
                Website
              </Typography>
            </Box>
            <Typography variant="body1">Srilanka Police</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, bgcolor: "#2866f2" }}
              target="_blank"
              href="https://www.police.lk/"
            >
              Visit Now
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </section>
  );
}