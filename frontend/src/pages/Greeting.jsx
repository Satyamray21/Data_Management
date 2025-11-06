import React, { useState, useMemo } from "react";
import {
    Box,
    Typography,
    Grid,
    Paper,
    TextField,
    Button,
    Chip,
    Stack,
    Snackbar,
    Avatar,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import EmailIcon from "@mui/icons-material/Email";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const FESTIVALS = {
    Hindu: [
        { name: "Diwali", greeting: "Wishing you a Diwali filled with light, love and laughter!" },
        { name: "Holi", greeting: "Happy Holi! May your life be as colorful as the festival itself." },
    ],
    Muslim: [
        { name: "Eid", greeting: "Eid Mubarak! May Allah bless you with happiness and peace." },
        { name: "Ramadan", greeting: "Ramadan Kareem — may this month bring you closer to your faith." },
    ],
    Christian: [
        { name: "Christmas", greeting: "Merry Christmas! May your holidays be merry and bright." },
        { name: "Easter", greeting: "Happy Easter! Wishing you hope and new beginnings." },
    ],
    Sikh: [
        { name: "Gurpurab", greeting: "Warm wishes on Gurpurab — may the Guru's blessings be with you." },
        { name: "Baisakhi", greeting: "Happy Baisakhi! May your harvest be plentiful and your home joyful." },
    ],
};

export default function FestivalGreetingPage() {
    const religions = Object.keys(FESTIVALS);
    const [selectedReligion, setSelectedReligion] = useState(religions[0]);
    const [festivalName, setFestivalName] = useState(FESTIVALS[religions[0]][0].name);
    const [customMessage, setCustomMessage] = useState("");
    const [senderName, setSenderName] = useState("");
    const [photo, setPhoto] = useState(null);
    const [snackOpen, setSnackOpen] = useState(false);

    const festivalsForReligion = useMemo(() => FESTIVALS[selectedReligion] || [], [selectedReligion]);
    const defaultGreeting =
        festivalsForReligion.find((f) => f.name.toLowerCase() === festivalName.toLowerCase())?.greeting ||
        "Warm wishes on this special day!";

    const cardText = useMemo(() => {
        let text = `${customMessage || defaultGreeting}`;
        if (senderName) text += `\n\nWith love, ${senderName}`;
        return text;
    }, [customMessage, defaultGreeting, senderName]);

    const handleShare = async () => {
        const sharePayload = { title: `${festivalName} Wishes`, text: cardText };
        if (navigator.share) {
            try {
                await navigator.share(sharePayload);
            } catch {
                console.log("Share cancelled or failed");
            }
        } else {
            await navigator.clipboard.writeText(cardText);
            setSnackOpen(true);
        }
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPhoto(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(cardText)}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cardText)}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(`${festivalName} Wishes`)}&body=${encodeURIComponent(cardText)}`;

    return (
        <Box sx={{ p: 4, bgcolor: "#f8f9fa", minHeight: "100vh" }}>
            <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
                Festival Greetings — Share Joy
            </Typography>

            <Grid container spacing={3}>
                {/* Left Side - Form */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Select Religion
                        </Typography>

                        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                            {religions.map((r) => (
                                <Chip
                                    key={r}
                                    label={r}
                                    color={r === selectedReligion ? "primary" : "default"}
                                    onClick={() => {
                                        setSelectedReligion(r);
                                        setFestivalName(FESTIVALS[r][0].name);
                                    }}
                                />
                            ))}
                        </Stack>

                        <TextField
                            label="Festival Name"
                            value={festivalName}
                            onChange={(e) => setFestivalName(e.target.value)}
                            fullWidth
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            label="Custom Message"
                            multiline
                            rows={3}
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            fullWidth
                            placeholder={defaultGreeting}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            label="Your Name"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            fullWidth
                            sx={{ mb: 2 }}
                        />

                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                            fullWidth
                            sx={{ mb: 3 }}
                        >
                            Upload Photo
                            <input hidden accept="image/*" type="file" onChange={handlePhotoUpload} />
                        </Button>

                        {photo && (
                            <Box textAlign="center" mb={2}>
                                <Avatar
                                    src={photo}
                                    alt="Uploaded"
                                    variant="rounded"
                                    sx={{ width: "100%", height: 180, borderRadius: 2 }}
                                />
                            </Box>
                        )}

                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" startIcon={<ShareIcon />} onClick={handleShare}>
                                Share
                            </Button>
                            <Button
                                variant="outlined"
                                color="success"
                                startIcon={<WhatsAppIcon />}
                                href={whatsappUrl}
                                target="_blank"
                            >
                                WhatsApp
                            </Button>
                        </Stack>

                        <Stack direction="row" spacing={2} mt={2}>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<FacebookIcon />}
                                href={facebookUrl}
                                target="_blank"
                            >
                                Facebook
                            </Button>
                            <Button variant="outlined" startIcon={<EmailIcon />} href={mailtoUrl}>
                                Email
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>

                {/* Right Side - Preview */}
                <Grid item xs={12} md={8}>
                    <Paper
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            textAlign: "center",
                            position: "relative",
                            overflow: "hidden",
                            bgcolor: "#fff8e1",
                        }}
                    >
                        {photo && (
                            <Box
                                component="img"
                                src={photo}
                                alt="Festival"
                                sx={{
                                    width: "100%",
                                    height: 300,
                                    objectFit: "cover",
                                    borderRadius: 2,
                                    mb: 3,
                                }}
                            />
                        )}

                        <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
                            {festivalName} Greetings
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                whiteSpace: "pre-line",
                                p: 3,
                                borderRadius: 2,
                                bgcolor: "#fff",
                            }}
                        >
                            {cardText}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Snackbar
                open={snackOpen}
                autoHideDuration={2000}
                onClose={() => setSnackOpen(false)}
                message="Copied to clipboard!"
            />
        </Box>
    );
}