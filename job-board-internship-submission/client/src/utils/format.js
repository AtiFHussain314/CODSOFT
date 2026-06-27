export const formatSalary = (job) => {
  if (!job.salaryMin && !job.salaryMax) return "Salary not listed";
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });

  if (job.salaryMin && job.salaryMax) return `${formatter.format(job.salaryMin)} - ${formatter.format(job.salaryMax)}`;
  return formatter.format(job.salaryMin || job.salaryMax);
};

export const timeAgo = (date) => {
  if (!date) return "Recently posted";
  const days = Math.max(1, Math.round((Date.now() - new Date(date).getTime()) / 86400000));
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
};

