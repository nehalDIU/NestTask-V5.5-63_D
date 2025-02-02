import { formatDate } from '../utils/dateUtils';
import type { Task } from '../types';
import type { Announcement } from '../types/announcement';

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;
const TELEGRAM_API = TELEGRAM_BOT_TOKEN ? `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}` : '';
const APP_DOMAIN = 'https://nesttask.vercel.app';

export async function sendTelegramMessage(text: string, photo?: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return false;
  }

  try {
    if (photo) {
      const response = await fetch(`${TELEGRAM_API}/sendPhoto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          photo,
          caption: text,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send Telegram photo message');
      }
    } else {
      const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send Telegram message');
      }
    }

    return true;
  } catch (error) {
    console.warn('Error sending Telegram notification:', error);
    return false;
  }
}


// Get category emoji
const getCategoryEmoji = (category: string) => {
  switch (category) {
    case 'presentation': return '👔';
    case 'assignment': return '📃';
    case 'quiz': return '📚';
    case 'lab-report': return '🔬';
    case 'lab-final': return '🧪';
    case 'documents': return '📄';
    case 'blc': return '🗃️';
    case 'groups': return '👥';
    default: return '📋';
  }
};

export async function sendTaskNotification(task: Task) {
  // Extract file URLs and get the first image
const fileUrls = task.description.match(/\[.*?\]\((.*?)\)/g)?.map(match => {
  const [, url] = match.match(/\[.*?\]\((.*?)\)/) || [];
  return url;
}) || [];

const imageUrl = fileUrls.find(url => 
  url?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
);

  // Format file section
  const fileSection = fileUrls.length 
    ? `\n\n📎 <b>Attachments:</b>\n${fileUrls.map((url, i) => 
        `${i + 1}. <a href="${url}">View File ${i + 1}</a>`
      ).join('\n')}`
    : '';

  // Process description to handle links and formatting
  const processDescription = (text: string) => {
    // Replace markdown-style links with HTML links
    const withLinks = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    // Preserve line breaks
    return withLinks.replace(/\n/g, '\n');
  };

  const message = `
🔔 <b>New ${task.isAdminTask ? 'Admin ' : ''}Task Alert!</b>

${getCategoryEmoji(task.category)} <b>${task.name}</b>


📝 <b>Description:</b>
${processDescription(task.description)}

🏷️ Category: #${task.category}
📅 Due Date: ${formatDate(new Date(task.dueDate), 'MMMM d, yyyy')}


🌐 <b>View full details:</b>
• ${APP_DOMAIN}

${task.isAdminTask ? '\n⚡️ Stay updated with NestTask!' : ''}`;

  return sendTelegramMessage(message, imageUrl);
}

export async function sendAnnouncementNotification(announcement: Announcement) {
  // Try to find an image URL in the announcement content
  const imageUrl = announcement.content.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/i)?.[0];

  const message = `
📢 <b>Important Announcement</b>

🔔 <b>${announcement.title}</b>

${announcement.content}


🌐 <b>View full details:</b>
• ${APP_DOMAIN}


⚡️ Stay updated with NestTask!`;

  return sendTelegramMessage(message, imageUrl);
}
