import asyncio
import aiohttp
from bs4 import BeautifulSoup
from typing import List, Dict, Any
import re
from urllib.parse import urljoin, quote
import json

class CourseScraperService:
    """
    Scrapes real courses from multiple educational platforms
    """
    
    def __init__(self):
        # Only enable platforms that work reliably
        self.platforms = {
            'coursera': {
                'base_url': 'https://www.coursera.org',
                'search_url': 'https://www.coursera.org/search?query={}',
                'enabled': True
            },
            'udemy': {
                'base_url': 'https://www.udemy.com',
                'search_url': 'https://www.udemy.com/courses/search/?q={}',
                'enabled': False  # Blocked by anti-scraping
            },
            'edx': {
                'base_url': 'https://www.edx.org',
                'search_url': 'https://www.edx.org/search?q={}',
                'enabled': True
            },
            'udacity': {
                'base_url': 'https://www.udacity.com',
                'search_url': 'https://www.udacity.com/courses/all?search={}',
                'enabled': False  # Blocked by anti-scraping
            },
            'pluralsight': {
                'base_url': 'https://www.pluralsight.com',
                'search_url': 'https://www.pluralsight.com/search?q={}',
                'enabled': False  # Rate limited
            },
            'linkedin_learning': {
                'base_url': 'https://www.linkedin.com/learning',
                'search_url': 'https://www.linkedin.com/learning/search?keywords={}',
                'enabled': False  # Requires authentication
            },
            'skillshare': {
                'base_url': 'https://www.skillshare.com',
                'search_url': 'https://www.skillshare.com/search?query={}',
                'enabled': False  # Blocked by anti-scraping
            },
            'khan_academy': {
                'base_url': 'https://www.khanacademy.org',
                'search_url': 'https://www.khanacademy.org/search?page_search_query={}',
                'enabled': True
            }
        }
        
        # Improved headers to avoid detection
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'max-age=0'
        }
    
    async def search_all_platforms(self, keywords: List[str], limit_per_platform: int = 10) -> List[Dict[str, Any]]:
        """
        Search all platforms for courses matching keywords
        """
        all_courses = []
        
        async with aiohttp.ClientSession(headers=self.headers) as session:
            tasks = []
            
            for keyword in keywords:
                for platform_name, platform_config in self.platforms.items():
                    if platform_config['enabled']:
                        task = self.scrape_platform(
                            session, 
                            platform_name, 
                            platform_config, 
                            keyword, 
                            limit_per_platform
                        )
                        tasks.append(task)
            
            # Execute all scraping tasks concurrently
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Flatten results
            for result in results:
                if isinstance(result, list):
                    all_courses.extend(result)
        
        # Remove duplicates based on title similarity
        unique_courses = self._deduplicate_courses(all_courses)
        
        return unique_courses
    
    async def scrape_platform(
        self, 
        session: aiohttp.ClientSession, 
        platform_name: str, 
        platform_config: Dict[str, Any], 
        keyword: str, 
        limit: int
    ) -> List[Dict[str, Any]]:
        """
        Scrape a specific platform for courses
        """
        try:
            search_url = platform_config['search_url'].format(quote(keyword))
            
            async with session.get(search_url, timeout=aiohttp.ClientTimeout(total=15)) as response:
                if response.status != 200:
                    # Silently skip failed platforms instead of printing errors
                    return []
                
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                
                # Platform-specific parsing
                if platform_name == 'coursera':
                    courses = self._parse_coursera(soup, platform_config['base_url'], keyword)
                elif platform_name == 'udemy':
                    courses = self._parse_udemy(soup, platform_config['base_url'], keyword)
                elif platform_name == 'edx':
                    courses = self._parse_edx(soup, platform_config['base_url'], keyword)
                elif platform_name == 'udacity':
                    courses = self._parse_udacity(soup, platform_config['base_url'], keyword)
                elif platform_name == 'pluralsight':
                    courses = self._parse_pluralsight(soup, platform_config['base_url'], keyword)
                elif platform_name == 'linkedin_learning':
                    courses = self._parse_linkedin(soup, platform_config['base_url'], keyword)
                elif platform_name == 'skillshare':
                    courses = self._parse_skillshare(soup, platform_config['base_url'], keyword)
                elif platform_name == 'khan_academy':
                    courses = self._parse_khan_academy(soup, platform_config['base_url'], keyword)
                else:
                    courses = []
                
                return courses[:limit]
                
        except asyncio.TimeoutError:
            print(f"Timeout scraping {platform_name}")
            return []
        except Exception as e:
            print(f"Error scraping {platform_name}: {str(e)}")
            return []
    
    def _parse_coursera(self, soup: BeautifulSoup, base_url: str, keyword: str) -> List[Dict[str, Any]]:
        """Parse Coursera search results"""
        courses = []
        
        # Try multiple selectors as Coursera's structure may vary
        course_cards = soup.find_all('div', class_=re.compile(r'cds-ProductCard'))
        if not course_cards:
            course_cards = soup.find_all('li', class_=re.compile(r'cds-9'))
        
        for card in course_cards[:15]:
            try:
                title_elem = card.find('h3') or card.find('h2') or card.find('a', class_=re.compile(r'card-title'))
                if not title_elem:
                    continue
                
                title = title_elem.get_text(strip=True)
                
                link_elem = card.find('a', href=True)
                url = urljoin(base_url, link_elem['href']) if link_elem else f"{base_url}/search?query={keyword}"
                
                # Extract provider
                provider_elem = card.find('p', class_=re.compile(r'partner')) or card.find('span', class_=re.compile(r'partner'))
                provider = provider_elem.get_text(strip=True) if provider_elem else 'Coursera'
                
                # Extract rating
                rating_elem = card.find('span', class_=re.compile(r'rating')) or card.find('div', class_=re.compile(r'ratings'))
                rating = rating_elem.get_text(strip=True) if rating_elem else 'N/A'
                
                courses.append({
                    'title': title,
                    'platform': 'Coursera',
                    'provider': provider,
                    'url': url,
                    'rating': rating,
                    'price': 'Varies',
                    'level': 'All Levels',
                    'keyword': keyword
                })
            except Exception as e:
                continue
        
        return courses
    
    def _parse_udemy(self, soup: BeautifulSoup, base_url: str, keyword: str) -> List[Dict[str, Any]]:
        """Parse Udemy search results"""
        courses = []
        
        course_cards = soup.find_all('div', class_=re.compile(r'course-card'))
        if not course_cards:
            course_cards = soup.find_all('div', {'data-purpose': 'course-card'})
        
        for card in course_cards[:15]:
            try:
                title_elem = card.find('h3') or card.find('div', {'data-purpose': 'course-title-url'})
                if not title_elem:
                    continue
                
                title = title_elem.get_text(strip=True)
                
                link_elem = card.find('a', href=True)
                url = urljoin(base_url, link_elem['href']) if link_elem else f"{base_url}/courses/search/?q={keyword}"
                
                # Extract price
                price_elem = card.find('span', class_=re.compile(r'price')) or card.find('div', {'data-purpose': 'course-price'})
                price = price_elem.get_text(strip=True) if price_elem else 'Paid'
                
                # Extract rating
                rating_elem = card.find('span', class_=re.compile(r'star-rating'))
                rating = rating_elem.get_text(strip=True) if rating_elem else 'N/A'
                
                courses.append({
                    'title': title,
                    'platform': 'Udemy',
                    'provider': 'Udemy',
                    'url': url,
                    'rating': rating,
                    'price': price,
                    'level': 'All Levels',
                    'keyword': keyword
                })
            except Exception as e:
                continue
        
        return courses
    
    def _parse_edx(self, soup: BeautifulSoup, base_url: str, keyword: str) -> List[Dict[str, Any]]:
        """Parse edX search results"""
        courses = []
        
        course_cards = soup.find_all('div', class_=re.compile(r'discovery-card'))
        
        for card in course_cards[:15]:
            try:
                title_elem = card.find('h3') or card.find('h4')
                if not title_elem:
                    continue
                
                title = title_elem.get_text(strip=True)
                
                link_elem = card.find('a', href=True)
                url = urljoin(base_url, link_elem['href']) if link_elem else f"{base_url}/search?q={keyword}"
                
                # Extract provider
                provider_elem = card.find('span', class_=re.compile(r'partner'))
                provider = provider_elem.get_text(strip=True) if provider_elem else 'edX'
                
                courses.append({
                    'title': title,
                    'platform': 'edX',
                    'provider': provider,
                    'url': url,
                    'rating': 'N/A',
                    'price': 'Free (Audit)',
                    'level': 'All Levels',
                    'keyword': keyword
                })
            except Exception as e:
                continue
        
        return courses
    
    def _parse_udacity(self, soup: BeautifulSoup, base_url: str, keyword: str) -> List[Dict[str, Any]]:
        """Parse Udacity search results"""
        courses = []
        
        course_cards = soup.find_all('div', class_=re.compile(r'card'))
        
        for card in course_cards[:15]:
            try:
                title_elem = card.find('h3') or card.find('h4')
                if not title_elem:
                    continue
                
                title = title_elem.get_text(strip=True)
                
                link_elem = card.find('a', href=True)
                url = urljoin(base_url, link_elem['href']) if link_elem else f"{base_url}/courses/all"
                
                courses.append({
                    'title': title,
                    'platform': 'Udacity',
                    'provider': 'Udacity',
                    'url': url,
                    'rating': 'N/A',
                    'price': 'Paid',
                    'level': 'Intermediate',
                    'keyword': keyword
                })
            except Exception as e:
                continue
        
        return courses
    
    def _parse_pluralsight(self, soup: BeautifulSoup, base_url: str, keyword: str) -> List[Dict[str, Any]]:
        """Parse Pluralsight search results"""
        courses = []
        
        course_cards = soup.find_all('div', class_=re.compile(r'search-result'))
        
        for card in course_cards[:15]:
            try:
                title_elem = card.find('h3') or card.find('a', class_=re.compile(r'course-title'))
                if not title_elem:
                    continue
                
                title = title_elem.get_text(strip=True)
                
                link_elem = card.find('a', href=True)
                url = urljoin(base_url, link_elem['href']) if link_elem else f"{base_url}/search?q={keyword}"
                
                courses.append({
                    'title': title,
                    'platform': 'Pluralsight',
                    'provider': 'Pluralsight',
                    'url': url,
                    'rating': 'N/A',
                    'price': 'Subscription',
                    'level': 'All Levels',
                    'keyword': keyword
                })
            except Exception as e:
                continue
        
        return courses
    
    def _parse_linkedin(self, soup: BeautifulSoup, base_url: str, keyword: str) -> List[Dict[str, Any]]:
        """Parse LinkedIn Learning search results"""
        courses = []
        
        course_cards = soup.find_all('div', class_=re.compile(r'search-result'))
        
        for card in course_cards[:15]:
            try:
                title_elem = card.find('h3') or card.find('h4')
                if not title_elem:
                    continue
                
                title = title_elem.get_text(strip=True)
                
                link_elem = card.find('a', href=True)
                url = urljoin(base_url, link_elem['href']) if link_elem else f"{base_url}/search?keywords={keyword}"
                
                courses.append({
                    'title': title,
                    'platform': 'LinkedIn Learning',
                    'provider': 'LinkedIn',
                    'url': url,
                    'rating': 'N/A',
                    'price': 'Subscription',
                    'level': 'All Levels',
                    'keyword': keyword
                })
            except Exception as e:
                continue
        
        return courses
    
    def _parse_skillshare(self, soup: BeautifulSoup, base_url: str, keyword: str) -> List[Dict[str, Any]]:
        """Parse Skillshare search results"""
        courses = []
        
        course_cards = soup.find_all('div', class_=re.compile(r'class-card'))
        
        for card in course_cards[:15]:
            try:
                title_elem = card.find('h2') or card.find('h3')
                if not title_elem:
                    continue
                
                title = title_elem.get_text(strip=True)
                
                link_elem = card.find('a', href=True)
                url = urljoin(base_url, link_elem['href']) if link_elem else f"{base_url}/search?query={keyword}"
                
                courses.append({
                    'title': title,
                    'platform': 'Skillshare',
                    'provider': 'Skillshare',
                    'url': url,
                    'rating': 'N/A',
                    'price': 'Subscription',
                    'level': 'All Levels',
                    'keyword': keyword
                })
            except Exception as e:
                continue
        
        return courses
    
    def _parse_khan_academy(self, soup: BeautifulSoup, base_url: str, keyword: str) -> List[Dict[str, Any]]:
        """Parse Khan Academy search results"""
        courses = []
        
        course_cards = soup.find_all('div', class_=re.compile(r'search-result'))
        
        for card in course_cards[:15]:
            try:
                title_elem = card.find('h3') or card.find('a')
                if not title_elem:
                    continue
                
                title = title_elem.get_text(strip=True)
                
                link_elem = card.find('a', href=True)
                url = urljoin(base_url, link_elem['href']) if link_elem else f"{base_url}/search?page_search_query={keyword}"
                
                courses.append({
                    'title': title,
                    'platform': 'Khan Academy',
                    'provider': 'Khan Academy',
                    'url': url,
                    'rating': 'N/A',
                    'price': 'Free',
                    'level': 'All Levels',
                    'keyword': keyword
                })
            except Exception as e:
                continue
        
        return courses
    
    def _deduplicate_courses(self, courses: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate courses based on title similarity"""
        unique_courses = []
        seen_titles = set()
        
        for course in courses:
            # Normalize title for comparison
            normalized_title = re.sub(r'[^\w\s]', '', course['title'].lower())
            normalized_title = ' '.join(normalized_title.split())
            
            if normalized_title not in seen_titles:
                seen_titles.add(normalized_title)
                unique_courses.append(course)
        
        return unique_courses

# Create singleton instance
course_scraper = CourseScraperService()
