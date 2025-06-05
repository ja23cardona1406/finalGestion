import { Router } from 'express';
import AgrosoftBot from './bot/AgrosoftBot';

export function createRoutes(bot: AgrosoftBot) {
  const router = Router();

  // Get QR code
  router.get('/qr', (req, res) => {
    const qrCode = bot.getQRCode();
    if (qrCode) {
      res.json({ qrCode, status: 'success' });
    } else {
      res.status(404).json({ 
        status: 'error', 
        message: 'QR code not available. Bot may already be authenticated or still initializing.' 
      });
    }
  });

  // Get bot status
  router.get('/status', (req, res) => {
    res.json({
      status: bot.getStatus(),
      isActive: bot.isActive(),
      stats: bot.getStats()
    });
  });

  // Get authorized contacts
  router.get('/contacts', (req, res) => {
    res.json({
      contacts: bot.getAuthorizedContacts(),
      count: bot.getAuthorizedContacts().length
    });
  });

  // Add new authorized contact
  router.post('/contacts', (req, res) => {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ status: 'error', message: 'Phone number is required' });
    }
    
    try {
      const result = bot.authorizeContact(phoneNumber);
      if (result) {
        res.json({ status: 'success', message: 'Contact authorized successfully' });
      } else {
        res.status(400).json({ status: 'error', message: 'Failed to authorize contact' });
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: (error as Error).message });
    }
  });

  // Remove authorized contact
  router.delete('/contacts/:phoneNumber', (req, res) => {
    const { phoneNumber } = req.params;
    
    try {
      const result = bot.removeAuthorizedContact(phoneNumber);
      if (result) {
        res.json({ status: 'success', message: 'Contact removed successfully' });
      } else {
        res.status(404).json({ status: 'error', message: 'Contact not found' });
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error', error: (error as Error).message });
    }
  });

  // Logout and clear session
  router.post('/logout', async (req, res) => {
    try {
      await bot.logout();
      res.json({ status: 'success', message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error logging out', error: (error as Error).message });
    }
  });

  // Restart the bot
  router.post('/restart', async (req, res) => {
    try {
      await bot.restart();
      res.json({ status: 'success', message: 'Bot restarted successfully' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error restarting bot', error: (error as Error).message });
    }
  });

  return router;
}